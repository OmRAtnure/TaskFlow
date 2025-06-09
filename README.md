# TaskFlow
Name: Om Atnure.

TaskFlow is a mobile application allowing user to write their daily and weekly task. It is made using react native and utilizes expo notifcation.

Features :
1. Users can switch between daily and weekly tasks.
2. Users can view completed tasks and restore them if needed.
3. Prioritized tasks: Tasks can be marked as Low, Medium, or High priority, and they are sorted accordingly (high priority tasks appear first).
4. User can edit task and change priority.
5. After 60 seconds of adding task their will be notifiaction for task.
6. Users can delete tasks.
7. Tasks are persistent and stored using AsyncStorage.
8. Tasks are scrollable.

Expo notification:
 - Notification are integrated
 - If task is completed before notification then scheduled notificatin is canceled.

Direction to run using expo Go:
  1. Download the ZIP of this repository and extract it.
  2. Install dependencies using: npx expo install (npm install if faced any issue).
  3. Open your Android emulator or connect an Android device.
  4. Start the Expo server with: npx expo start (press a for andriod after metro bundler)

  -- or install the provided APK file on andriod to use the app directly.
  APK file link: https://drive.google.com/drive/folders/1ZwJDz0Xzz7T_ucQkgBdZXopv1wXSVgms
  
Interesting design choice:
1. Instead of a single list, the tasks are divided into daily and weekly sections to properly plan our tasks.
2. Priority levels are visually indicated using subtle color and tasks are automatically sorted by priority (high-priority tasks appear at the top).

Challanges faced:
One of the challanges i faced was making data presistant 
- normally we would use database for storing/retreving task.
- but in this project tasks were stored in asyncStorage.
- Loading and storing of tasks was handled using useEffect
- So the issue was initially the app would overwrite stored tasks with an empty array on startup because useEffect triggered a save, before the tasks were loaded.
- To solve this problem isReady state was created which ensures that task will be stored if isReady is true (isReady is set to true after fetching previous task), so we can properly  fetch previously stored tasks.


