@echo off
echo Updating Expo packages to their expected versions...
echo.

cd %~dp0
npm install
echo.
echo Packages updated successfully!
echo.
pause