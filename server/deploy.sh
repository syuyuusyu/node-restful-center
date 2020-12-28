v="latest"
#ip="10.10.50.199:5000"
ip="192.168.50.28:5000"
name="restful-center"
docker build -t $name:$v . &&
docker tag $name:$v $ip/$name:$v &&
docker push $ip/$name:$v 