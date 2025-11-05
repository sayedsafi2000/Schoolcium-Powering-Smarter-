# MongoDB Setup Guide for Windows

## The Error You're Seeing
```
MongoDB Connection Error: MongooseServerSelectionError: connect ECONNREFUSED ::1:27017
```

This means MongoDB is not running on your system.

## Solution: Start MongoDB

### Option 1: Start MongoDB Service (Recommended)

1. **Open Command Prompt as Administrator:**
   - Press `Windows Key + X`
   - Select "Windows PowerShell (Admin)" or "Command Prompt (Admin)"

2. **Start MongoDB Service:**
   ```cmd
   net start MongoDB
   ```

3. **If the service name is different, try:**
   ```cmd
   net start MongoDBDB
   ```
   or check what MongoDB services are installed:
   ```cmd
   sc query | findstr MongoDB
   ```

### Option 2: Start MongoDB via Services Manager

1. Press `Windows Key + R`
2. Type `services.msc` and press Enter
3. Find "MongoDB" or "MongoDB Server" in the list
4. Right-click and select "Start"

### Option 3: Start MongoDB Manually (If installed but not as service)

If MongoDB is installed but not running as a service:

1. Navigate to MongoDB installation directory (usually `C:\Program Files\MongoDB\Server\<version>\bin`)
2. Open Command Prompt in that directory
3. Run:
   ```cmd
   mongod --dbpath "C:\data\db"
   ```
   (Create the `C:\data\db` folder if it doesn't exist)

### Option 4: Install MongoDB (If not installed)

1. **Download MongoDB Community Server:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows x64
   - Download and run the installer

2. **During installation:**
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Choose "Run service as Network Service user"
   - Install MongoDB Compass (optional, but helpful)

3. **After installation:**
   - MongoDB should start automatically
   - If not, use Option 1 or 2 above

## Verify MongoDB is Running

After starting MongoDB, you should see in your terminal:
```
MongoDB Connected Successfully
```

Or test the connection:
```cmd
mongosh
```
or (older versions):
```cmd
mongo
```

## Alternative: Use MongoDB Atlas (Cloud)

If you prefer not to install MongoDB locally, you can use MongoDB Atlas:

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `backend/.env` file:
   ```
   MONGODB_URI=your-atlas-connection-string
   ```

## Troubleshooting

### Port 27017 already in use
If you get a port conflict error:
1. Find what's using the port:
   ```cmd
   netstat -ano | findstr :27017
   ```
2. Kill the process or change MongoDB port

### Permission denied
- Make sure you're running Command Prompt as Administrator
- Check MongoDB data directory permissions (`C:\data\db`)

### Service won't start
- Check MongoDB logs (usually in `C:\Program Files\MongoDB\Server\<version>\log`)
- Verify MongoDB is properly installed
- Try reinstalling MongoDB

## After MongoDB is Running

Once MongoDB starts successfully, your backend server should connect automatically. You'll see:
```
MongoDB Connected Successfully
Server is running on port 5000
```

Your application is now ready to use!

