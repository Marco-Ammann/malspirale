# API Setup for Development

To test the contact form during local development, you'll need to set up a local PHP server.

## Option 1: XAMPP/WAMP/MAMP

1. Install [XAMPP](https://www.apachefriends.org/), [WAMP](https://www.wampserver.com/), or [MAMP](https://www.mamp.info/)
2. Create a folder in your web root: `malspirale-api`
3. Copy `src/server/sendMail.php` to this folder

## Option 2: PHP's Built-in Server

If you have PHP installed, you can run:

```bash
cd path/to/api/folder
php -S localhost:80
```

## Using the Proxy Configuration

The project is set up with a proxy configuration that redirects API requests to your local PHP server.
When you run `npm start`, it will use this proxy configuration automatically.

## Production Deployment

For production, the build process will include the PHP files in the output. Make sure your FTP deployment
process uploads these files to your hosting service correctly.
