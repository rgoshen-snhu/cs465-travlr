const port = process.env.PORT ?? 3000;
const loginEndpoint = `http://localhost:${port}/api/login`;
const registerEndpoint = `http://localhost:${port}/api/register`;

const COOKIE_NAME = 'travlr-token';
const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'lax',
};

/* GET /login — render the login form */
const loginGet = (req, res) => {
    res.render('login', {
        title: 'Login',
        navPage: 'login',
        error: req.query.error || null,
    });
};

/* GET /signup — render the registration form */
const signupGet = (req, res) => {
    res.render('signup', {
        title: 'Sign Up',
        navPage: 'signup',
        error: req.query.error || null,
    });
};

/* POST /login — authenticate an existing customer */
const loginPost = async (req, res) => {
    const { email, password } = req.body;
    try {
        const response = await fetch(loginEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok && data.token) {
            res.cookie(COOKIE_NAME, data.token, COOKIE_OPTIONS);
            return res.redirect('/travel');
        }
        const message = data.message || 'Invalid email or password';
        return res.redirect(`/login?error=${encodeURIComponent(message)}`);
    } catch (error) {
        console.error('Login error:', error);
        return res.redirect('/login?error=Service+unavailable');
    }
};

/* POST /signup — register a new customer */
const signupPost = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const response = await fetch(registerEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        if (response.ok && data.token) {
            res.cookie(COOKIE_NAME, data.token, COOKIE_OPTIONS);
            return res.redirect('/travel');
        }
        const message = data.message || 'Registration failed';
        return res.redirect(`/signup?error=${encodeURIComponent(message)}`);
    } catch (error) {
        console.error('Signup error:', error);
        return res.redirect('/signup?error=Service+unavailable');
    }
};

/* GET /logout — clear session cookie and return to home */
const logout = (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect('/');
};

module.exports = { loginGet, loginPost, signupGet, signupPost, logout };
