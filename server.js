const http = require('node:http');

const port = process.env.PORT || 8080;
const team = process.env.TEAM_NAME || 'deep-roots';

const submissions = [];

const podName =
  process.env.HOSTNAME || 'unknown';

function recommendation(interest, contribution) {
  if (interest === 'Kubernetes' && contribution === 'Code') {
    return 'Argo CD';
  }

  if (interest === 'Observability') {
    return 'OpenTelemetry';
  }

  if (interest === 'GitOps') {
    return 'Flux CD';
  }

  if (interest === 'AI') {
    return 'Kubeflow';
  }

  return 'Backstage';
}

function nextStep(goal) {
  if (goal === 'A Mentor') {
    return 'Introduce yourself to an experienced contributor during the Deep Roots gathering.';
  }

  if (goal === 'My First Contribution') {
    return 'Look for a project labeled "good first issue".';
  }

  if (goal === 'A Community') {
    return 'Join the project Slack or Discord and attend a community meeting.';
  }

  return 'Connect with project maintainers and learn where help is needed.';
}

function whyThisFits(interest) {
  if (interest === 'Kubernetes') {
    return 'Kubernetes has one of the largest and most active open source communities.';
  }

  if (interest === 'AI') {
    return 'AI-related cloud native projects are rapidly growing and welcome contributors.';
  }

  if (interest === 'Observability') {
    return 'Observability projects such as OpenTelemetry welcome contributors across code, docs, and community participation.';
  }

  if (interest === 'GitOps') {
    return 'GitOps projects help organizations automate deployments and have active contributor communities.';
  }

  if (interest === 'Security') {
    return 'Security remains a critical cloud native challenge and many CNCF projects are actively seeking contributors.';
  }

  return 'Your selected interest aligns well with active CNCF communities.';
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/healthz' || url.pathname === '/readyz') {
    res.writeHead(200);
    return res.end('ok');
  }

  if (url.pathname === '/live') {
    const regionCounts = {};
    const goalCounts = {};
    const interestCounts = {};

    submissions.forEach((s) => {
      regionCounts[s.region] =
        (regionCounts[s.region] || 0) + 1;

      goalCounts[s.goal] =
        (goalCounts[s.goal] || 0) + 1;

      interestCounts[s.interest] =
        (interestCounts[s.interest] || 0) + 1;
    });

    const regionRows = Object.entries(regionCounts)
      .map(([k, v]) => `<li>${k}: ${v}</li>`)
      .join('');

    const goalRows = Object.entries(goalCounts)
      .map(([k, v]) => `<li>${k}: ${v}</li>`)
      .join('');

    const interestRows = Object.entries(interestCounts)
      .map(([k, v]) => `<li>${k}: ${v}</li>`)
      .join('');

    res.writeHead(200, {
      'content-type': 'text/html; charset=utf-8'
    });

    return res.end(`
      <!doctype html>

      <h1>🌍 Deep Roots Community Pulse</h1>

      <h2>Regions</h2>
      <ul>
      ${regionRows || '<li>No responses yet</li>'}
      </ul>

      <h2>Goals</h2>
      <ul>
      ${goalRows || '<li>No responses yet</li>'}
      </ul>

      <h2>Popular Interests</h2>
      <ul>
      ${interestRows || '<li>No responses yet</li>'}
      </ul>

      <p>
      <strong>Total Participants:</strong>
      ${submissions.length}
      </p>

      <p>
      <a href="/">Return Home</a>
      </p>

      <p>
      <strong>Served By:</strong> ${podName}
      </p>
    `);
  }

  if (url.pathname === '/submit' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const params = new URLSearchParams(body);

      const name = params.get('name');
      const region = params.get('region');
      const experience = params.get('experience');
      const interest = params.get('interest');
      const goal = params.get('goal');
      const contribution = params.get('contribution');

      submissions.push({
        name,
        region,
        experience,
        interest,
        goal,
        contribution
      });

      console.log('New submission:', {
        name,
        region,
        experience,
        interest,
        goal,
        contribution
      });

      const project = recommendation(interest, contribution);
      const step = nextStep(goal);
      const explanation = whyThisFits(interest);

      res.writeHead(200, {
        'content-type': 'text/html; charset=utf-8'
      });

      res.end(`
        <!doctype html>

        <h1>🌱 Your Deep Roots Path</h1>

        <p>
        Welcome, ${name}!
        </p>

        <h2>Recommended Project</h2>

        <p>
        ${project}
        </p>

        <h2>Your Profile</h2>

        <ul>
        <li><strong>Region:</strong> ${region}</li>
        <li><strong>Experience:</strong> ${experience}</li>
        <li><strong>Interest:</strong> ${interest}</li>
        <li><strong>Goal:</strong> ${goal}</li>
        <li><strong>Contribution Style:</strong> ${contribution}</li>
        </ul>

        <h2>Why This Recommendation Fits</h2>

        <p>
        ${explanation}
        </p>

        <h2>Suggested First Step</h2>

        <p>
        ${step}
        </p>

        <h2>KubeCon Action Item</h2>

        <p>
        Since you're looking for <strong>${goal}</strong>, use the Deep Roots
        Community Gathering to connect with people who share similar interests
        and learn how they got started in open source.
        </p>

        <p>
        <a href="/live">View Community Pulse</a>
        </p>

        <p>
        <a href="/">Start Over</a>
        </p>

        <p>
        <strong>Served By:</strong> ${podName}
        </p>
      `);      
    });

    return;
  }

  res.writeHead(200, {
    'content-type': 'text/html; charset=utf-8'
  });

  res.end(`
    <!doctype html>
    <title>Deep Roots Community Gathering | KubeCon</title>

    <h1>Deep Roots Community Gathering</h1>

    <h2>Find Your Open Source Path at KubeCon</h2>

    <p>
      Hosted by Curtis Cook and Ashwin Sarimin at KubeCon North America.
    </p>

<p>
Answer a few questions and discover CNCF projects,
open source communities, mentors, and contribution
opportunities tailored to your interests.
</p>

    <form method="POST" action="/submit">
      <p>
        <label>Name</label><br>
        <input name="name" required>
      </p>

      <p>
        <label>Region</label><br>
        <select name="region">
          <option>Africa</option>
          <option>Europe</option>
          <option>North America</option>
          <option>South America</option>
          <option>Asia</option>
          <option>Other</option>
        </select>
      </p>

      <p>
        <label>Experience</label><br>
        <select name="experience">
          <option>Student</option>
          <option>New Contributor</option>
          <option>Engineer</option>
          <option>Platform Engineer</option>
        </select>
      </p>

      <p>
        <label>Interest</label><br>
        <select name="interest">
          <option>Kubernetes</option>
          <option>AI</option>
          <option>Observability</option>
          <option>GitOps</option>
          <option>Security</option>
        </select>
      </p>

      <p>
        <label>What are you looking for?</label><br>
        <select name="goal">
          <option>My First Contribution</option>
          <option>A Mentor</option>
          <option>A Community</option>
          <option>Speaking Opportunities</option>
          <option>Career Advice</option>
          <option>Open Source Projects</option>
        </select>
      </p>

      <p>
        <label>Contribution Type</label><br>
        <select name="contribution">
          <option>Code</option>
          <option>Documentation</option>
          <option>Community</option>
          <option>Speaking</option>
        </select>
      </p>

      <button type="submit">
        Find My Open Source Path
      </button>
    </form>

    <p>
      <a href="/live">Live Community Interest Map</a>
    </p>
  `);
});

server.listen(port, () => {
  console.log(`listening on ${port}`);
});
