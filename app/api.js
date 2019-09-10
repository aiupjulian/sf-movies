fetch('/api').then(response => {
  return response.json();
}).then(data => {
  console.log(data);
});