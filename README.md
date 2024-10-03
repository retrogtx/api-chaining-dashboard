# API Chain Setup Guide

First ofcourse, do a npm install followed by npm run dev.

## 1. Start with the "Get Users List" API
- In the "Available APIs" section, click on "Get Users List" to add it as the first step.

## 2. Add the "Create New Post" API
- Click on "Create New Post" to add it as the second step.

## 3. Configure the "Create New Post" step
1. In the "Select Fields from Previous Steps" section, click "Add Field".
2. In the left input, type "userId".
3. In the right dropdown, select "Step 1: id".
4. In the "Request Body (JSON)" textarea, enter:
   ```json
   {
     "title": "Test Post",
     "body": "This is a test post created by the API chain."
   }
   ```
5. In the "Transformation (JavaScript code)" input, enter:
   ```javascript
   data => ({ ...data, id: 1 })
   ```
   This transformation ensures that the post ID is set to 1, which is known to have comments in the JSONPlaceholder API.

## 4. Add the "Get Comments by Post" API
- Click on "Get Comments by Post" to add it as the third step.

## 5. Configure the "Get Comments by Post" step
1. In the "Select Fields from Previous Steps" section, click "Add Field".
2. In the left input, type "postId".
3. In the right dropdown, select "Step 2: id".

## 6. (Optional) Add transformations
- In the "Get Users List" step, you can add a transformation to get only the first user:
  - Enter `data[0]` in the "Transformation" input.
- In the "Get Comments by Post" step, you can add a transformation to get only the first 5 comments:
  - Enter `data.slice(0, 5)` in the "Transformation" input.

## 7. Execute the chain
- Click the "Execute Chain" button at the bottom of the form.

## 8. View the results
- Check the "API Chain Visualization" section below the form.
- Each step will show its response. You can expand the "Array" or "Object" details to see the full response data.

## 9. Analyze the results
- The first step should show user data.
- The second step should show the created post data with the id set to 1.
- The third step should now show comments for the post with id 1.

Remember to check the browser's console for detailed logs of each API call. This can be helpful for debugging if you're not seeing the expected results.

By adding the transformation `data => ({ ...data, id: 1 })` to the "Create New Post" step, we ensure that we're always working with a post ID that has associated comments, making the chain more predictable and easier to work with when using the JSONPlaceholder API.