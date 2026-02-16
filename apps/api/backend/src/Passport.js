const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// Helper to create JWT token
function createToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
}

// =========================
// GOOGLE STRATEGY
// =========================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.OAUTH_CALLBACK_URL}/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value.toLowerCase();

        let user = await prisma.user.findUnique({
          where: { email },
        });

        // Create user if not exists
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName || "Google User",
              email,
              password: "OAUTH_USER",
              role: "tester",
              isVerified: true,
            },
          });
        }

        const token = createToken(user);
        return done(null, { token });
      } catch (err) {
        console.error("Google OAuth Error:", err);
        return done(err, null);
      }
    }
  )
);

// =========================
// GITHUB STRATEGY
// =========================
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.OAUTH_CALLBACK_URL}/github/callback`,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // GitHub sometimes doesn't return email directly
        const email =
          profile.emails && profile.emails.length
            ? profile.emails[0].value.toLowerCase()
            : `${profile.username}@github-oauth.local`;

        let user = await prisma.user.findUnique({
          where: { email },
        });

        // Create user if not exists
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.username || "GitHub User",
              email,
              password: "OAUTH_USER",
              role: "tester",
              isVerified: true,
            },
          });
        }

        const token = createToken(user);
        return done(null, { token });
      } catch (err) {
        console.error("GitHub OAuth Error:", err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
