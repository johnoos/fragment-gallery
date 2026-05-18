export function showSpinner() {
  const spinner = document.getElementById('page-spinner');
  if (spinner) spinner.classList.add('active');
}

export function hideSpinner() {
  const spinner = document.getElementById('page-spinner');
  if (spinner) spinner.classList.remove('active');
}