@echo off
echo Starting Farmers Market Backend...
echo.
cd /d "C:\Users\MSI\Downloads\Full\FarmersMarketPlace"
echo Current directory: %CD%
echo.
echo Compiling and starting Spring Boot application...
call mvnw.cmd clean spring-boot:run
pause
