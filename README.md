# Foodie

Foodie is a local food experience tracking web app. It allows users to keep track of what they eat at various restaurants by posting reviews and pictures.
Each post comprises
1.	What was ordered
2.	Location
3.	Review details
4.	Picture of food

# Functionality of the application

A user can signup using an email address and password or google account.
The web app allows users to create/remove/update/list Experience records. 
An attachment image of the food can be uploaded as well. Each user only has access to Experience records that he/she has created.

Each Experience item contains the following fields:

* `experienceId` (string) - a unique id for an experience
* `createdAt` (string) - date and time when an experience was created
* `foodDetails` (string) - Details of the meal which was ordered
* `location` (string) - Location of the restaurant
* `review` (string) - Review by user
* `attachmentUrl` (string) (optional) - a URL pointing to an image of food attached to the Experience record


## Prerequisites

* [AWS Account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html)
* [AWS CLI](https://aws.amazon.com/cli/)
* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx 
* Serverless 
   * Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
   * Install the Serverless Framework’s CLI  (up to VERSION=2.21.1). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.
   ```bash
   npm install -g serverless@2.21.1
   serverless --version
   ```
   * Login and configure serverless to use the AWS credentials 
   ```bash
   # Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
   serverless login
   # Configure serverless to use the AWS credentials to deploy the application
   # You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
   sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
   ```
   


# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.
