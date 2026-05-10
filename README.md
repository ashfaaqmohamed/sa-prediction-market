# 🇿🇦 SA Predict – South Africa Prediction Market
Local Polymarket clone focused on South Africa (play-money only).

## Quick Start
1. Unzip this project
2. Follow the instructions in each folder's README
3. Run backend + frontend locally
4. Upload your `sample-questions.xlsx` via the Bulk Upload page

Enjoy building South Africa's own prediction market! 🚀

## Share It Publicly

This repo now includes a Render Blueprint at [render.yaml](/Users/ash/Downloads/Prediction APP/sa-prediction-market/render.yaml) so you can deploy the app as:

1. one public Node web service that serves both the React frontend and the API
2. one hosted PostgreSQL database

### Render Deploy Steps

1. Push this project to GitHub or GitLab
2. In Render, create a new Blueprint and point it at the repo
3. Render will create:
   - `sa-predict-app`
   - `sa-predict-db`
4. Wait for the first deploy to finish
5. Open the generated `onrender.com` URL and share it

### Local Note

In local development the frontend still talks to `http://localhost:5001/api`, but in production it automatically uses `/api` on the same hosted domain.
