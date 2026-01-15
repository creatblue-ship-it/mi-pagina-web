# Contact List App

A simple contact management application built with Node.js, Express, SQLite, and vanilla JavaScript.

## Features

- Add new contacts with name, email, and phone number
- View all contacts in a clean, responsive interface
- Data persists in SQLite database
- RESTful API backend
- Modern, gradient UI design
- Ready for Azure App Service deployment

## Project Structure

```
MiProyecto/
├── server.js           # Express server and API endpoints
├── package.json        # Project dependencies
├── web.config          # Azure App Service/IIS configuration
├── .deployment         # Azure deployment configuration
├── deploy.cmd          # Azure deployment script
├── .gitignore          # Git ignore rules
├── contacts.db         # SQLite database (created automatically)
├── public/
│   └── index.html     # Frontend HTML/CSS/JS
└── README.md          # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Azure account (for Azure deployment)
- Git (for deployment)

## Local Installation

1. Navigate to the project directory:
```bash
cd Desktop/MiProyecto
```

2. Install dependencies:
```bash
npm install
```

## Running the Application Locally

1. Start the server:
```bash
npm start
```

Or, for development with auto-restart:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. The application is now running! You can:
   - Add contacts using the form
   - View all contacts below the form
   - Data is automatically saved to the SQLite database

## Deploying to Azure App Service

### Method 1: Deploy from Local Git

1. **Create an Azure App Service:**
   ```bash
   # Login to Azure
   az login
   
   # Create a resource group (if you don't have one)
   az group create --name myResourceGroup --location "East US"
   
   # Create an App Service plan
   az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku B1 --is-linux
   
   # Create the web app
   az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myContactListApp --runtime "NODE|18-lts"
   ```

2. **Initialize Git and deploy:**
   ```bash
   # Initialize git repository (if not already done)
   git init
   git add .
   git commit -m "Initial commit"
   
   # Configure Azure deployment
   az webapp deployment user set --user-name <username> --password <password>
   
   # Add Azure as a git remote
   az webapp deployment source config-local-git --name myContactListApp --resource-group myResourceGroup
   
   # Get the deployment URL
   az webapp deployment list-publishing-credentials --name myContactListApp --resource-group myResourceGroup --query scmUri --output tsv
   
   # Push to Azure
   git remote add azure <deployment-url>
   git push azure main
   ```

3. **Browse your app:**
   ```bash
   az webapp browse --name myContactListApp --resource-group myResourceGroup
   ```

### Method 2: Deploy from GitHub

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Configure GitHub deployment in Azure Portal:**
   - Go to Azure Portal → App Services → Your App
   - Select "Deployment Center"
   - Choose "GitHub" as source
   - Authorize and select your repository
   - Configure branch (main/master)
   - Save

3. **Azure will automatically deploy on every push to the selected branch**

### Method 3: Deploy using VS Code

1. **Install Azure App Service extension in VS Code**

2. **Sign in to Azure:**
   - Click Azure icon in sidebar
   - Sign in to your Azure account

3. **Deploy:**
   - Right-click on the project folder
   - Select "Deploy to Web App"
   - Select subscription and app name
   - Confirm deployment

### Azure Configuration Notes

- **web.config**: Configures IIS/iisnode for running Node.js on Azure
- **Environment Variables**: Azure automatically sets `PORT` environment variable
- **Node Version**: Specified in `package.json` engines field
- **Database**: SQLite database file persists in the app's file system
  - Note: For production, consider using Azure SQL or Cosmos DB for better reliability
- **Logs**: View logs using `az webapp log tail --name myContactListApp --resource-group myResourceGroup`

### Post-Deployment Checklist

- [ ] Verify app is running: `https://<your-app-name>.azurewebsites.net`
- [ ] Test adding and viewing contacts
- [ ] Check application logs for any errors
- [ ] Configure custom domain (optional)
- [ ] Enable HTTPS (enabled by default)
- [ ] Set up Application Insights for monitoring (optional)

## API Endpoints

### GET /api/contacts
Returns all contacts in JSON format.

**Response:**
```json
{
  "contacts": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "123-456-7890",
      "created_at": "2024-01-01 12:00:00"
    }
  ]
}
```

### POST /api/contacts
Creates a new contact.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890"
}
```

**Response:**
```json
{
  "message": "Contact added successfully",
  "contact": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890"
  }
}
```

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** better-sqlite3 (SQLite3)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Hosting:** Azure App Service (ready)
- **Dev Tools:** Nodemon (optional, for development)

## Stopping the Server (Local)

Press `Ctrl+C` in the terminal where the server is running.

## Troubleshooting

### Local Development

**Port already in use:**
The app automatically uses `process.env.PORT` or defaults to 3000. Azure will set this automatically.

**Database errors:**
If you encounter database errors, delete `contacts.db` and restart the server. The database will be recreated automatically.

**Dependencies not installed:**
Make sure you run `npm install` before starting the server.

### Azure Deployment

**Deployment failed:**
- Check deployment logs: `az webapp log tail`
- Verify Node.js version in `package.json` engines field
- Ensure all dependencies are in `dependencies` (not `devDependencies`)

**App not starting:**
- Check if `web.config` is properly configured
- Verify `server.js` is the entry point in `package.json`
- Check application logs in Azure Portal

**Database not persisting:**
- SQLite works on Azure but consider using Azure SQL for production
- Database file is stored in the app's file system
- App restarts may cause data loss; backup regularly

## Production Considerations

For production deployments, consider:
- Using Azure SQL Database or Cosmos DB instead of SQLite
- Implementing authentication and authorization
- Adding rate limiting and security headers
- Setting up Application Insights for monitoring
- Configuring auto-scaling
- Using Azure Key Vault for sensitive configuration

## License

ISC
