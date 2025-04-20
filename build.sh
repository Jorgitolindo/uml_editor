(mkdir backend/src/main/resources/static || true) && cd frontend &&
  npm i && npm run build --prod &&
  cp -v dist/frontend/browser/* ../backend/src/main/resources/static/. &&
  cd ../backend && ./mvnw clean package
