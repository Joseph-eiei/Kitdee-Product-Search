# Start backend server
Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command cd 'replace your backend path' ; npm start"

# Start frontend server
Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command cd 'replace your frontend path' ; npm start"

# Keep the PowerShell window open
pause
