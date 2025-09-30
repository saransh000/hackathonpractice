# MongoDB Atlas Setup Guide

## Quick Setup Instructions:

1. Go to: https://www.mongodb.com/atlas
2. Click "Try Free"
3. Create account with your email
4. Choose "Free Tier" (M0 Sandbox)
5. Select a cloud provider (AWS recommended)
6. Choose region closest to you
7. Click "Create Cluster"

## Get Connection String:
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. It looks like: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/

## Update Backend Configuration:
Replace the MONGODB_URI in your .env file with the Atlas connection string.