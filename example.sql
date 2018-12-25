/*
 Navicat Premium Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 100310
 Source Host           : 127.0.0.1
 Source Database       : elemental

 Target Server Type    : MySQL
 Target Server Version : 100310
 File Encoding         : utf-8

 Date: 12/25/2018 09:38:29 AM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `invoke_info`
-- ----------------------------
DROP TABLE IF EXISTS `invoke_info`;
CREATE TABLE `invoke_info` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `descrption` varchar(200) DEFAULT NULL,
  `method` varchar(10) DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `head` text DEFAULT NULL,
  `body` text DEFAULT NULL,
  `parseFun` text DEFAULT NULL,
  `orginalResult` longtext DEFAULT NULL,
  `next` varchar(50) DEFAULT NULL,
  `invokeType` char(1) DEFAULT NULL COMMENT '1:接口调用配置,2:可调用接口',
  `groupName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
--  Records of `invoke_info`
-- ----------------------------
BEGIN;
INSERT INTO `invoke_info` VALUES ('1', 'keystoneToken', '获取openstack token', 'post', 'http://@keystoneIP/v3/auth/tokens?nocatalog=', '{\n    \"Accept\":\"application/json\",\n    \"Content-Type\":\"application/json;charset=UTF-8\"\n}', '{\n    \"auth\": {\n      \"identity\": {\n        \"methods\": [\n          \"password\"\n        ],\n        \"password\": {\n          \"user\": {\n            \"domain\": {\n              \"name\": \"default\"\n            },\n            \"name\": \"@name\",\n            \"password\": \"@password\"\n          }\n        }\n      }\n      \n    }\n  }', 'function parse(obj,head){\n     return [{token:head[\'x-subject-token\']}];\n}', null, '2', '1', 'example'), ('2', 'server_list', '获取云主机列表', 'get', 'http://@ComputeIP/v2.1/servers', '{\n    \"Accept\":\"application/json\",\n    \"Content-Type\":\"application/json;charset=UTF-8\",\n    \"X-Auth-Token\":\"@token\"\n}', '{}', 'function parse(obj){\n  if(obj.error && obj.error.code===401){\n  	return {status:401}\n  }\n   return obj.servers.map(o=>({instanceId:o.id,instanceName:o.name}))\n}', null, '3', '1', 'example'), ('3', 'monitor_info', '获取虚拟机信息指标', 'get', 'http://@MetricIP/v1/resource/instance/@instanceId', '{\n    \"Accept\":\"application/json\",\n    \"Content-Type\":\"application/json;charset=UTF-8\",\n    \"X-Auth-Token\":\"@token\",\n    \"instanceName\":\"@instanceName\"\n}', '{}', 'function parse(obj,responsehead,responsestatus,requesthead){\n    let result=[];\n    let propertys=[\'vcpus\',\'cpu_util\',\'memory\',\'memory.usage\',\'disk.root.size\',\'disk.usage\'];\n    propertys.forEach(key=>{\n    	result.push({propertyName:key,propertyId:obj.metrics[key],instanceName:requesthead.instanceName});\n    });\n	return result;\n}', null, '4', '1', 'example'), ('4', 'monitor_detail', '获取每个指标的数据', 'get', 'http://@MetricIP/v1/metric/@propertyId/measures ', '{\n    \"Accept\":\"application/json\",\n    \"Content-Type\":\"application/json;charset=UTF-8\",\n    \"X-Auth-Token\":\"@token\",\n    \"instanceName\":\"@instanceName\",\n    \"propertyName\":\"@propertyName\"\n}', '{}', 'function parse(response,responsehead,responsestatus,requesthead){\n    let average=0;\n    if(response.map && response.length>0){\n       average=response.map(o=>o[2]).reduce((a,b)=>a+b);\n       average=average/response.length;\n       average=average.toFixed(2);\n    }\n    return {instanceName:requesthead.instanceName,propertyName:requesthead.propertyName,value:average}\n}', null, null, '1', 'example'), ('5', 'monitor_api', '云机监控', 'post', null, '{\n    \"Accept\":\"application/json\",\n    \"Content-Type\":\"application/json;charset=UTF-8\"\n}', '{}', 'function parse(obj){\n\n  let isOk=true;\n  if(obj.forEach){\n    obj.forEach(o=>{\n      if(o[\'server_list-1-2\'] && o[\'server_list-1-2\'].status){\n        isOk=false;\n      }\n    });\n  }\n  if(!isOk){\n    return {status:401};\n  }\n  let result=[];\n  for(let key in obj[0]){\n    if(/(monitor_detail)-\\d+/.test(key))\n      result.push(obj[0][key]);\n  }\n  let instenceNames=new Set();\n  result.forEach(o=>instenceNames.add(o.instanceName));\n  let table=[];\n  instenceNames.forEach(n=>table.push({instanceName:n}));\n  while(result.length>0){\n    let o=result.pop();\n    for(let i=0;i<table.length;i++){\n      if(table[i].instanceName===o.instanceName){\n        table[i][o.propertyName]=o.value;\n      }\n    }\n\n  }\n  return table;\n}', null, '1', '2', 'example');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
