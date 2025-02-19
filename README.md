# Dermascope

Please see the SignUpForm.tsx file, and replace the following line:

```typescript
const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/signup`, {

with

const response = await axios.post('http://localhost:5000/api/signup', {