import { useState, useEffect, useRef, useCallback } from "react";

/* ── DATA ────────────────────────────────────────────────── */
const SKILLS = [
  {
    icon: "🖥️", title: "Frontend", color: "teal",
    tags: ["React", "EJS" ,"HTML" ,"CSS","javascript"],
  },
  {
    icon: "⚙️", title: "Backend", color: "purple",
    tags: ["Node.js", "Express", "Python", "FastAPI", "REST APIs", "WebSockets"],
  },
  {
    icon: "🗄️", title: "Data & DB", color: "orange",
    tags: [ "MongoDB", "MySQL"],
  },
 
];

const PROJECTS = [
  {
    num: "01", cat: "Full Stack", title: " Video Conference App",
    desc: "Developed a video conferencing application enabling users to create accounts and initiate video calls.Implemented real-time chat functionality allowing participants within the same video call to communicate seamlessly.Integrated screen-sharing capabilities for desktop users to enhance collaboration during meetings.",
    stack: [ "Node.js", "Express.js", "MongoDB", "React.js"],
    links: [{ label: "Live demo", href: "https://video-conference-app-frontend-iopw.onrender.com/" }, { label: "GitHub", href: "https://github.com/ansuman1232/video_conference_App" }],
  },
  {
    num: "02", cat: "Full Stack", title: "Wanderer",
    desc: "A property rental website where users can view property details, add/edit properties, and write reviews. Includes account creation, login/logout functionality. Follows MVC architecture.",
    stack: ["Node.js", "Express.js", "MongoDB", "HTML", "CSS", "JavaScript"],
    links: [{ label: "Live Demo", href: "https://wanderer-wfnb.onrender.com/listing" }, { label: "GitHub", href: "https://github.com/ansuman1232/WandererDeploy" }],
  },
  {
    num: "03", cat: "AI Tool", title: "AI-PLANT-DISEASE-DETECTION",
    desc: "Developed a web application utilizing machine learning to detect and analyze plant diseases from images.Users can upload a photo of a plant to receive instant diagnosis, including disease type, symptoms, and treatment recommendations.Employed ResNET50 model for accurate disease detection.",
    stack: ["React", "Flask"],
    links: [{ label: "", href: "" }, { label: "GitHub", href: "https://github.com/ansuman1232/plant_disease_detection" }],
  },
  
];

const EXPERIENCE = [
  {
    date: "May 2025 — July 2025", company: "Total Technology System", role: " Full Stack Developer intern",
    desc: "Developed a website utilizing EJS for the frontend, MySQL for the database, and Express.js for the backend.Implemented authentication and authorization features.Architected a secure authentication system with Passport.js and Bcrypt (Cost Factor: 10), ensuring user credentials remain encrypted and resistant to brute-force and rainbow table attacks for a projected user base of 100+. Developed a dual-tier search algorithm with MySQL and Express.js, achieving a 30% improvement in product specification retrieval speed compared to standard sequential querying.",
  },
  {
     date: "May 2026 — June 2026", company: "The Entrepreneurship Network ", role: " MERN Stack Developer intern",
    desc: "Implemented a double-token system with short-lived access tokens and secure refresh token rotation, enhancing session security and enabling stateless authentication.Utilized Mongoose sessions and transactions (startSession, startTransaction, commit/abort) to ensure atomic updates for doctor applications, user roles,and notifications.Integrated the Gemini API to develop an AI assistant, automating user support and enhancing user experience",
  }
  
];

const NAV_LINKS = ["About", "Skills", "Projects", "Experience"];

/* ── CANVAS HOOK — moving dots + lines ───────────────────── */
function useAnimatedCanvas(canvasRef) {
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef  = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, dots;

    const CONNECT_DIST = 140;   // max distance to draw a line
    const MOUSE_DIST   = 180;   // mouse attraction radius
    const DOT_COUNT    = () => Math.floor((W * H) / 12000); // density

    const onMouse = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = ()  => { mouseRef.current = { x: -9999, y: -9999 }; };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseleave", onLeave);

    // Palette: teal, purple, soft-white
    const COLORS = [
      [0, 220, 168],
      [124, 106, 247],
      [180, 200, 230],
    ];

    class Dot {
      constructor() { this.init(); }
      init() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        // slow random velocity
        const speed = 0.3 + Math.random() * 0.5;
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.r  = 1.5 + Math.random() * 2;
        this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.baseAlpha = 0.5 + Math.random() * 0.5;
      }
      update() {
        // gentle mouse attraction
        const { x: mx, y: my } = mouseRef.current;
        const dx = mx - this.x, dy = my - this.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_DIST && d > 0) {
          const force = (1 - d / MOUSE_DIST) * 0.03;
          this.vx += (dx / d) * force;
          this.vy += (dy / d) * force;
        }
        // speed cap
        const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (spd > 1.8) { this.vx = (this.vx / spd) * 1.8; this.vy = (this.vy / spd) * 1.8; }

        this.x += this.vx;
        this.y += this.vy;

        // wrap around edges
        if (this.x < -10) this.x = W + 10;
        if (this.x > W + 10) this.x = -10;
        if (this.y < -10) this.y = H + 10;
        if (this.y > H + 10) this.y = -10;
      }
      draw() {
        const [r, g, b] = this.col;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${this.baseAlpha})`;
        ctx.fill();
      }
    }

    function drawLines() {
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.35;
            // blend the two dot colors for the line
            const [r1,g1,b1] = dots[i].col;
            const [r2,g2,b2] = dots[j].col;
            const r = Math.round((r1+r2)/2), g = Math.round((g1+g2)/2), b = Math.round((b1+b2)/2);
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
        // also connect to mouse
        const { x: mx, y: my } = mouseRef.current;
        const dx = dots[i].x - mx, dy = dots[i].y - my;
        const dm = Math.sqrt(dx*dx + dy*dy);
        if (dm < MOUSE_DIST) {
          const alpha = (1 - dm / MOUSE_DIST) * 0.6;
          const [r,g,b] = dots[i].col;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    function init() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      dots = Array.from({ length: DOT_COUNT() }, () => new Dot());
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      drawLines();
      dots.forEach(d => { d.update(); d.draw(); });
      animRef.current = requestAnimationFrame(frame);
    }

    window.addEventListener("resize", init);
    init();
    frame();

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animRef.current);
    };
  }, [canvasRef]);
}

/* ── REVEAL HOOK ─────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {  setVisible(e.isIntersecting); }, { threshold: 0.12 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [visible]);
  return [ref, visible];
}

/* ── SMALL COMPONENTS ────────────────────────────────────── */
function SectionTag({ children }) {
  return (
    <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.74rem", letterSpacing: "0.25em",
      color: "#00dca8", textTransform: "uppercase", marginBottom: "0.9rem" }}>
      <span style={{ color: "#6a7f96" }}>// </span>{children}
    </p>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.02em",
      lineHeight: 1.1, marginBottom: "0.5rem", color: "#e8eef5" }}>
      {children}
    </h2>
  );
}

function SectionLine() {
  return <div style={{ width: 60, height: 3, borderRadius: 2, marginBottom: "3rem", marginTop: "0.8rem",
    background: "linear-gradient(90deg,#00dca8,#7c6af7)" }} />;
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal();

    let style1={
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.7s ${delay}s, transform 0.7s ${delay}s`,
      ...style,
    }
  
  //   useEffect(() => {
  //   if (visible) {
  //     ref.current.querySelectorAll("div").forEach((el) => {
  //       el.classList.add({style1});
  //     });
  //   } else {
  //     ref.current.querySelectorAll("div").forEach((el) => {
  //       el.classList.remove({style1});
  //     });
  //   }
  // }, [visible]);



  return (
    <div ref={ref} style={style1}>
      {children}
    </div>
  );
}

function Tag({ children, color = "teal" }) {
  const palettes = {
    teal:   { bg: "rgba(0,220,168,0.08)",   border: "rgba(0,220,168,0.28)",   text: "#00dca8" },
    purple: { bg: "rgba(124,106,247,0.1)",  border: "rgba(124,106,247,0.3)",  text: "#7c6af7" },
    orange: { bg: "rgba(247,162,106,0.1)",  border: "rgba(247,162,106,0.3)",  text: "#f7a26a" },
  };
  const p = palettes[color] || palettes.teal;
  return (
    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem",
      padding: "0.28rem 0.65rem", borderRadius: 3, background: p.bg,
      border: `0.5px solid ${p.border}`, color: p.text, letterSpacing: "0.05em" }}>
      {children}
    </span>
  );
}

function Btn({ href = "#", variant = "primary", children, style: sx = {} }) {
  const base = {
    padding: "0.72rem 1.75rem", fontFamily: "'Space Mono',monospace", fontSize: "0.8rem",
    letterSpacing: "0.1em", textDecoration: "none", borderRadius: 4,
    display: "inline-block", cursor: "pointer", transition: "all 0.22s", ...sx,
  };
  if (variant === "primary") return (
    <a href={href} style={{ ...base, background: "#00dca8", color: "#060a10", fontWeight: 700 }}
      onMouseEnter={e => { e.target.style.background="#00f7c0"; e.target.style.transform="translateY(-2px)"; e.target.style.boxShadow="0 8px 28px rgba(0,220,168,0.28)"; }}
      onMouseLeave={e => { e.target.style.background="#00dca8"; e.target.style.transform="translateY(0)"; e.target.style.boxShadow="none"; }}>
      {children}
    </a>
  );
  return (
    <a href={href} style={{ ...base, border: "1px solid rgba(0,220,168,0.2)", color: "#e8eef5", background: "transparent" }}
      onMouseEnter={e => { e.target.style.borderColor="#7c6af7"; e.target.style.color="#7c6af7"; e.target.style.transform="translateY(-2px)"; }}
      onMouseLeave={e => { e.target.style.borderColor="rgba(0,220,180,0.2)"; e.target.style.color="#e8eef5"; e.target.style.transform="translateY(0)"; }}>
      {children}
    </a>
  );
}

/* ── SECTIONS ────────────────────────────────────────────── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);

  const anim = (delay) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.8s ${delay}s, transform 0.8s ${delay}s`,
  });
//...anim(0.3),
  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center",alignItems:"center", padding: "0 5vw", paddingTop: "5rem" }}>
    
         <p style={{... anim(0.3), fontFamily: "'Space Mono',monospace", fontSize: "0.76rem",
          letterSpacing: "0.25em", color: "#00dca8", textTransform: "uppercase", marginBottom: "1.4rem" }}>
          <span style={{ color: "#6a7f96" }}>&gt; </span>Available for freelance &amp; full-time roles
         </p>


      
      <h1 style={{... anim(0.4),  fontSize: "clamp(3.2rem,10vw,8rem)", fontWeight: 800,
        lineHeight: 0.93, letterSpacing: "-0.03em", color: "#e8eef5" }}>
          <span style={{ background: "linear-gradient(90deg,#00dca8 0%,#7c6af7 55%,#f7a26a 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          Ansuman
        </span><br/>
           Mishra<br />
        
      </h1>

      <p style={{  maxWidth: 540, marginTop: "1.8rem", fontSize: "1.08rem",
        fontWeight: 400, color: "#6a7f96", lineHeight: 1.75 }}>
        Full Stack Developer crafting scalable web apps from database to deployment.
        I turn complex problems into elegant, production-ready solutions.
      </p>

      <div style={{ ...anim(0.9), display: "flex", gap: "1rem", marginTop: "2.2rem", flexWrap: "wrap" }}>
        <Btn href="#projects" variant="primary">View my work</Btn>
        <Btn href="#contact" variant="outline">Get in touch</Btn>
      </div>

      
    
    </section>
  );
}

function About() {
  return (
    <section id="about" style={{ padding: "7rem 5vw" }}>
      <SectionTag>About me</SectionTag>
      <SectionHeading>Turning ideas into<br />living software</SectionHeading>
      <SectionLine />
   
        <Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" ,justifyContent:"center" }}>
            {[
              "Software Development Engineer with hands-on experience in React.js, and Node.js. Developed innovative applications through a technical",
             "internship and academic projects, including a dual-tier search algorithm that achieved a 30% improvement in retrieval speed. Ready to tackle",
             "complex challenges and drive impactful solutions as a Software Development Engineer in a dynamic environment." 
            ].map((text, i) => (
              <p key={i} style={{ color: "#6a7f96", lineHeight: 1.85, fontSize: "1rem" }}>{text}</p>
            ))}
            <div style={{ marginTop: "1rem" }}>
              <Btn href="https://drive.google.com/file/d/1tjSw6RYSLaXhYlY4yKXNy-CcRvtFL6MX/view?usp=drive_link" variant="outline" style={{ fontSize: "0.78rem" }}>résumé →</Btn>
            </div>
          </div>
        </Reveal>
      

    </section>
  );
}

function Skills() {
  const colorMap = { teal: "teal", purple: "purple", orange: "orange" };
  return (
    <section id="skills" style={{ padding: "7rem 5vw", background: "rgba(13,21,32,0.5)" }}>
      <SectionTag>Tech stack</SectionTag>
      <SectionHeading>What I work with</SectionHeading>
      <SectionLine />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "1.4rem" }}>
        {SKILLS.map((cat, i) => (
          <Reveal key={cat.title} delay={i * 0.1}>
            <SkillCard cat={cat} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SkillCard({ cat }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: "rgba(13,21,32,0.85)", border: `0.5px solid ${hovered ? "#00dca8" : "rgba(0,220,168,0.15)"}`,
        borderRadius: 8, padding: "1.7rem", transition: "all 0.3s",
        transform: hovered ? "translateY(-5px)" : "translateY(0)" }}>
      <div style={{ fontSize: "1.8rem", marginBottom: "0.9rem" }}>{cat.icon}</div>
      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#e8eef5", marginBottom: "1rem" }}>{cat.title}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
        {cat.tags.map(tag => <Tag key={tag} color={cat.color}>{tag}</Tag>)}
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" style={{ padding: "7rem 5vw" }}>
      <SectionTag>Selected work</SectionTag>
      <SectionHeading>Projects</SectionHeading>
      <SectionLine />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.4rem" }}>
        {PROJECTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.1}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);
  const tagColors = ["teal", "purple", "orange"];
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: "rgba(13,21,32,0.85)", borderRadius: 8, padding: "2rem",
        position: "relative", overflow: "hidden", transition: "all 0.3s",
        border: `0.5px solid ${hovered ? "rgba(0,220,168,0.45)" : "rgba(0,220,168,0.15)"}`,
        transform: hovered ? "translateY(-5px)" : "translateY(0)" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "linear-gradient(90deg,#00dca8,#7c6af7)",
        opacity: hovered ? 1 : 0, transition: "opacity 0.3s" }} />
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem",
        color: "#00dca8", letterSpacing: "0.1em", marginBottom: "1rem" }}>
        {project.num} — {project.cat}
      </div>
      <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#e8eef5", marginBottom: "0.7rem" }}>
        {project.title}
      </div>
      <p style={{ fontSize: "0.9rem", color: "#6a7f96", lineHeight: 1.75, marginBottom: "1.4rem" }}>
        {project.desc}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.4rem" }}>
        {project.stack.map((s, i) => <Tag key={s} color={tagColors[i % 3]}>{s}</Tag>)}
      </div>
      <div style={{ display: "flex", gap: "1.2rem", fontFamily: "'Space Mono',monospace", fontSize: "0.74rem" }}>
        {project.links.map(l => (
          <a key={l.label} href={l.href} style={{ color: "#6a7f96", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#00dca8"}
            onMouseLeave={e => e.target.style.color = "#6a7f96"}>
            {l.label} →
          </a>
        ))}
      </div>
    </div>
  );
}

function Experience() {
  return (
    <section id="experience" style={{ padding: "7rem 5vw", background: "rgba(13,21,32,0.5)" }}>
      <SectionTag>Career</SectionTag>
      <SectionHeading>Experience</SectionHeading>
      <SectionLine />
      <div style={{ maxWidth: 760 }}>
        {EXPERIENCE.map((exp, i) => (
          <Reveal key={exp.company} delay={i * 0.1}>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "2rem",
              padding: "2rem 0", borderBottom: i < EXPERIENCE.length - 1 ? "0.5px solid rgba(0,220,168,0.15)" : "none" }}>
              <div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.76rem",
                  color: "#00dca8", letterSpacing: "0.05em" }}>{exp.date}</div>
                <div style={{ fontSize: "0.8rem", color: "#6a7f96", marginTop: "0.3rem" }}>{exp.company}</div>
              </div>
              <div>
                <div style={{ fontSize: "1.08rem", fontWeight: 700, color: "#e8eef5", marginBottom: "0.7rem" }}>
                  {exp.role}
                </div>
                <p style={{ fontSize: "0.9rem", color: "#6a7f96", lineHeight: 1.8 }}>{exp.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" style={{ padding: "7rem 5vw", textAlign: "center" }}>
      <SectionTag>Let's work together</SectionTag>
      <SectionHeading>Got a project in mind?</SectionHeading>
      <div style={{ width: 60, height: 3, borderRadius: 2, margin: "0.8rem auto 2rem",
        background: "linear-gradient(90deg,#00dca8,#7c6af7)" }} />
      <p style={{ color: "#6a7f96", maxWidth: 460, margin: "0 auto 2.2rem", lineHeight: 1.75, fontSize: "1rem" }}>
        I'm currently open to freelance contracts and full-time positions.
        Drop me a line — I reply within 24 hours.
      </p>
      <a href="mailto:anshumanmishra1232@gmail.com" variant="primary" style={{ fontSize: "0.84rem" }}>
      anshumanmishra1232@gmail.com
      </a>
      <div style={{ display: "flex", justifyContent: "center", gap: "0.9rem", marginTop: "1.8rem", flexWrap: "wrap" }}>
        {[ ["GitHub"," https://github.com/ansuman1232"], ["LinkedIn","https://www.linkedin.com/in/ansuman-mishra1232/"]].map(label => (
          <a key={label[0]} href={`${label[1]}`}
            style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.75rem", letterSpacing: "0.1em",
              color: "#6a7f96", textDecoration: "none", padding: "0.55rem 1.1rem",
              border: "0.5px solid rgba(0,220,168,0.15)", borderRadius: 4, transition: "all 0.22s" }}
            onMouseEnter={e => { e.target.style.borderColor="#00dca8"; e.target.style.color="#00dca8"; }}
            onMouseLeave={e => { e.target.style.borderColor="rgba(0,220,168,0.15)"; e.target.style.color="#6a7f96"; }}>
            {label[0]}
          </a>
        ))}
      </div>
    </section>
  );
}

function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "1.1rem 5vw",
      background: scrolled ? "rgba(6,10,16,0.8)" : "rgba(6,10,16,0.4)",
      backdropFilter: "blur(14px)",
      borderBottom: `0.5px solid ${scrolled ? "rgba(0,220,168,0.18)" : "rgba(0,220,168,0.07)"}`,
      transition: "all 0.3s" }}>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.95rem", color: "#00dca8", letterSpacing: "0.05em" }}>
        AM<span style={{ color: "#6a7f96" }}>.dev</span>
      </div>
      <ul style={{ listStyle: "none", display: "flex", gap: "2rem", margin: 0, padding: 0 }}>
        {NAV_LINKS.map(link => (
          <li key={link}>
            <a href={`#${link.toLowerCase()}`}
              style={{ fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.12em",
                textTransform: "uppercase", color: active === link.toLowerCase() ? "#00dca8" : "#6a7f96",
                textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#00dca8"}
              onMouseLeave={e => e.target.style.color = active === link.toLowerCase() ? "#00dca8" : "#6a7f96"}>
              {link}
            </a>
          </li>
        ))}
        <li>
          <a href="#contact"
            style={{ fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#00dca8", textDecoration: "none",
              padding: "0.42rem 1rem", border: "1px solid #00dca8", borderRadius: 4, transition: "all 0.22s" }}
            onMouseEnter={e => { e.target.style.background="#00dca8"; e.target.style.color="#060a10"; }}
            onMouseLeave={e => { e.target.style.background="transparent"; e.target.style.color="#00dca8"; }}>
            Contact me
          </a>
        </li>
      </ul>
    </nav>
  );
}

/* ── ROOT APP ────────────────────────────────────────────── */
export default function App() {
  const canvasRef = useRef(null);
  useAnimatedCanvas(canvasRef);

   const [activeSection, setActiveSection] = useState("hero");


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #060a10; font-family: 'Syne', sans-serif; color: #e8eef5; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #060a10; }
        ::-webkit-scrollbar-thumb { background: #00dca8; border-radius: 3px; }
        @media (max-width: 768px) {
          nav ul { display: none; }
          #about > div:last-child { grid-template-columns: 1fr !important; }
          #experience > div:last-child > div > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar active={activeSection} />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
        <footer style={{ borderTop: "0.5px solid rgba(0,220,168,0.15)", padding: "1.8rem 5vw",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: "'Space Mono',monospace", fontSize: "0.72rem", color: "#6a7f96", flexWrap: "wrap", gap: "1rem" }}>
          
          <span>Built with React + Canvas API</span>
          <span style={{ color: "#00dca8" }}>Available for work</span>
        </footer>
      </div>
    </>
  );
}