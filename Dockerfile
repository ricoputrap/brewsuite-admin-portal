FROM node:23-alpine as base

# set the working directory inside the container
WORKDIR /src

# copy the package.json file into the /src directory in the container
COPY package.json .

# install pnpm
RUN npm install -g pnpm

RUN pnpm install

# copy the rest of the files into the /src directory
COPY . .

# run our nextjs app in development mode
CMD pnpm run dev