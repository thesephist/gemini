const render = ({
    title,
}) => {
    return `
<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${title}</title>
    <link rel="stylesheet" href="/static/css/main.css">
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-126639713-1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());

      gtag('config', 'UA-126639713-1');
    </script>
  </head>

  <body>
    <header>
      <div id="logo">
        <a href="/">
          <img src="/static/img/logo.png" alt="Studybuddy">
        </a>
      </div>
      <nav>
        <a href="/signup" class="signupLink">sign up</a>
        <a href="/faq">faq</a>
        <a href="/contact">contact</a>
      </nav>
    </header>
    <main>
    `;
}

module.exports = render;

