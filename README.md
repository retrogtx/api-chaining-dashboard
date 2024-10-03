Start with the "Get Users List" API:
In the "Available APIs" section, click on "Get Users List" to add it as the first step.
Add the "Create New Post" API:
Click on "Create New Post" to add it as the second step.
Configure the "Create New Post" step:
In the "Select Fields from Previous Steps" section, click "Add Field".
In the left input, type "userId".
In the right dropdown, select "Step 1: id".
In the "Request Body (JSON)" textarea, enter:
     {
       "title": "Test Post",
       "body": "This is a test post created by the API chain."
     }
In the "Transformation (JavaScript code)" input, enter:
     data => ({ ...data, id: 1 })
This transformation ensures that the post ID is set to 1, which is known to have comments in the JSONPlaceholder API.
Add the "Get Comments by Post" API:
Click on "Get Comments by Post" to add it as the third step.
Configure the "Get Comments by Post" step:
In the "Select Fields from Previous Steps" section, click "Add Field".
In the left input, type "postId".
In the right dropdown, select "Step 2: id".
(Optional) Add transformations:
In the "Get Users List" step, you can add a transformation to get only the first user:
Enter data[0] in the "Transformation" input.
In the "Get Comments by Post" step, you can add a transformation to get only the first 5 comments:
Enter data.slice(0, 5) in the "Transformation" input.
Execute the chain:
Click the "Execute Chain" button at the bottom of the form.
View the results:
Check the "API Chain Visualization" section below the form.
Each step will show its response. You can expand the "Array" or "Object" details to see the full response data.
Analyze the results:
The first step should show user data.
The second step should show the created post data with the id set to 1.
The third step should now show comments for the post with id 1.
Remember to check the browser's console for detailed logs of each API call. This can be helpful for debugging if you're not seeing the expected results.
By adding the transformation 
data => ({ ...data, id: 1 })
to the "Create New Post" step, we ensure that we're always working with a post ID that has associated comments, making the chain more predictable and easier to work with when using the JSONPlaceholder API.