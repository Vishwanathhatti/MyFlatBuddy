# Instructions to Get SonarQube Internal URL

## Option 1: Ask Your Friend
Ask your friend who has the working pipeline:
"What is the SonarQube service URL you're using in your Jenkinsfile?"

They're using: http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000

## Option 2: Ask Your Instructor
"What is the internal Kubernetes service URL for SonarQube on our Jenkins server?"

## Option 3: Check Jenkins Configuration
1. Go to Jenkins: http://jenkins.imcc.com/
2. Navigate to: Manage Jenkins → System
3. Look for "SonarQube servers" section
4. Check the "Server URL" configured there

## Once You Have the URL:

Update the Jenkinsfile:
1. Open f:\FlatBuddy\Jenkinsfile
2. Find line with: SONAR_URL = 'http://...'
3. Replace with the correct internal URL
4. Commit and push:
   ```
   git add Jenkinsfile
   git commit -m "Update SonarQube internal URL"
   git push origin Deployment2
   ```

## Current Status:
- Using: http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000
- This might work if your setup is identical to your friend's
- If not, you need the correct URL from your instructor
