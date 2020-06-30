VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | awk '{$1=$1};1')
eval $(echo docker build --no-cache -t thomaschampagne/traefik-sso:"$VERSION" -t thomaschampagne/traefik-sso:latest .)
docker image prune -f
