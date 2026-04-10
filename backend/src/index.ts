import app from './app';

const PORT = parseInt(process.env.PORT || '3004', 10);

app.listen(PORT, () => {
  console.log(`MealPrep API running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
