import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Brain, Sparkles, Layout, Calendar, Zap,
  BarChart, ArrowRight, Twitter, Github, CheckCircle
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Index() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Refs for animations
  const navRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);

  const featuresRef = useRef<HTMLElement>(null);
  const featureHeadingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const howItWorksRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // 1. Hero Load Animations
    const tl = gsap.timeline();

    tl.fromTo(navRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0)
      .fromTo(badgeRef.current, { scale: 0.8, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 0.15)
      .fromTo(
        headlineRef.current?.querySelectorAll(".word"),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power4.out" },
        0.3
      )
      .fromTo(subtextRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 0.45)
      .fromTo(buttonsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 0.6)
      .fromTo(heroImgRef.current, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out" }, 0.6);

    // 2. Scroll Progress Bar
    gsap.to(".scroll-progress", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1
      }
    });

    // 3. Parallax Hero Image
    gsap.to(heroImgRef.current, {
      y: 100,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // 4. Features Section
    gsap.fromTo(featureHeadingRef.current?.querySelector(".underline-gradient"),
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: featureHeadingRef.current, start: "top 80%" } }
    );

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.2)", scrollTrigger: { trigger: card, start: "top 85%" } }
      );
    });

    // 5. How It Works Section
    stepsRef.current.forEach((step, i) => {
      if (!step) return;
      gsap.fromTo(step,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: step, start: "top 80%" } }
      );
    });

    gsap.fromTo(lineRef.current,
      { scaleY: 0 },
      { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".steps-container", start: "top 60%", end: "bottom 60%", scrub: true } }
    );

    // 6. Parallax images in How It Works
    gsap.to(".hiw-parallax-fast", {
      y: -50, ease: "none", scrollTrigger: { trigger: howItWorksRef.current, start: "top bottom", end: "bottom top", scrub: 0.5 }
    });
    gsap.to(".hiw-parallax-slow", {
      y: -20, ease: "none", scrollTrigger: { trigger: howItWorksRef.current, start: "top bottom", end: "bottom top", scrub: 1 }
    });

    // 7. CTA Banner
    gsap.fromTo(ctaRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ctaRef.current, start: "top 85%" } }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });
  };

  const featureData = [
    { title: "RAG-Powered Explanations", icon: Sparkles, color: "text-purple-600", bg: "bg-purple-100", desc: "Get highly accurate step-by-step explanations powered by advanced AI memory." },
    { title: "Adaptive Quizzes", icon: Brain, color: "text-teal-600", bg: "bg-teal-100", desc: "Quizzes that adjust in real-time based on your evolving knowledge gaps." },
    { title: "Smart Scheduling", icon: Calendar, color: "text-[#3B3BF9]", bg: "bg-blue-100", desc: "AI instantly creates a realistic timeline designed specifically for your exams." },
    { title: "Spaced Repetition", icon: Zap, color: "text-green-600", bg: "bg-green-100", desc: "Optimize long-term retention by studying at the scientifically perfect intervals." },
    { title: "Important Questions", icon: Layout, color: "text-purple-600", bg: "bg-purple-100", desc: "Automatically extract and focus on the most high-yield concepts from your text." },
    { title: "Gamification", icon: BarChart, color: "text-yellow-600", bg: "bg-yellow-100", desc: "Level up, earn badges, and maintain streaks to keep your motivation peaking." },
  ];

  return (
    <div className="font-sans bg-[#F5F5F7] text-gray-900 overflow-x-hidden relative">
      {/* Global Scroll Progress */}
      <div className="scroll-progress fixed top-0 left-0 h-1 bg-[#3B3BF9] w-full origin-left transform scale-x-0 z-50"></div>

      {/* Navbar */}
      <nav ref={navRef} className="fixed w-full flex justify-between items-center py-5 px-8 md:px-16 z-40 bg-[#F5F5F7]/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <div className="w-8 h-8 rounded bg-[#3B3BF9] flex items-center justify-center text-white">
            <BookOpen size={18} />
          </div>
          StudyBuddy
        </div>
        <div className="flex items-center gap-4">

          <Link to="/create-plan" className="text-sm font-medium bg-[#3B3BF9] text-white px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-[#3B3BF9]/30 transition-all active:scale-95 duration-300">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-8 md:px-16 overflow-hidden min-h-[90vh] flex items-center"
      >
        {/* Mouse Glow */}
        <div
          className="pointer-events-none absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-30 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle, rgba(59,59,249,0.8) 0%, rgba(59,59,249,0) 70%)',
            left: cursorPos.x - 300,
            top: cursorPos.y - 300,
          }}
        />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <div className="flex flex-col items-start gap-6">
            <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-medium text-[#3B3BF9]">
              <Sparkles size={16} />
              AI-Powered Learning Platform
            </div>

            <h1 ref={headlineRef} className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              <div className="overflow-hidden pb-2"><span className="word inline-block">Study</span> <span className="word inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#3B3BF9] to-[#F97316]">Smarter,</span></div>
              <div className="overflow-hidden pb-4"><span className="word inline-block">Not</span> <span className="word inline-block">Harder</span></div>
            </h1>

            <p ref={subtextRef} className="text-lg text-gray-600 max-w-md leading-relaxed">
              Transform your documents into interactive quizzes, structured timelines, and RAG-powered study sessions. Master any subject in half the time.
            </p>

            <div ref={buttonsRef} className="flex flex-wrap gap-4 mt-2">
              <Link to="/create-plan" className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#3B3BF9] text-white font-medium hover:shadow-xl hover:shadow-[#3B3BF9]/25 hover:-translate-y-1 transition-all duration-300">
                Create Your Study Plan <ArrowRight size={18} />
              </Link>
              <button className="px-6 py-3.5 rounded-full bg-white border border-gray-200 text-gray-900 font-medium hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 shadow-sm">
                See How It Works
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div ref={heroImgRef} className="relative w-full h-[500px] rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-100 flex flex-col justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-orange-50/30 opacity-50 pointer-events-none" />
            {/* Abstract visual replacing actual image */}
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 border-[8px] border-[#F97316]/20 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-4 border-[6px] border-[#3B3BF9]/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain size={80} className="text-[#3B3BF9] drop-shadow-xl" />
              </div>
            </div>
            {/* Small floating badges */}
            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur px-4 py-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><CheckCircle size={16} /></div>
              <div>
                <div className="text-xs text-gray-500 font-medium">Feature</div>
                <div className="text-sm font-bold text-gray-900">Smart Explanations</div>
              </div>
            </div>
            <div className="absolute top-12 right-6 bg-white/90 backdrop-blur px-4 py-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600"><Zap size={16} /></div>
              <div>
                <div className="text-xs text-gray-500 font-medium">Dynamic</div>
                <div className="text-sm font-bold text-gray-900">Adaptive Quizzes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 px-8 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div ref={featureHeadingRef} className="text-center mb-16 inline-block w-full">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 inline-block relative pb-4">
              Everything You Need to Ace Your Exams
              <div className="underline-gradient absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#3B3BF9] to-[#F97316] origin-left scale-x-0 rounded-full" />
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureData.map((feat, idx) => (
              <div
                key={idx}
                ref={el => cardsRef.current[idx] = el}
                className="bg-[#F5F5F7]/50 rounded-3xl p-8 border border-gray-100 hover:border-[#3B3BF9]/30 hover:bg-white hover:shadow-2xl hover:shadow-[#3B3BF9]/5 hover:-translate-y-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group"
              >
                <div className={`w-14 h-14 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`}>
                  <feat.icon size={26} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-24 px-8 md:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B3BF9] to-[#F97316]">StudyBuddy</span> Works
            </h2>
            <p className="text-xl text-gray-600">From upload to mastery in four simple steps.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Steps Left Side */}
            <div className="steps-container relative flex flex-col gap-12 py-8">
              <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gray-200 rounded-full overflow-hidden">
                <div ref={lineRef} className="w-full h-full bg-[#3B3BF9] origin-top scale-y-0" />
              </div>

              {[
                { step: "01", title: "Upload Your Materials", desc: "Drag and drop your PDFs, lecture nodes, or paste text directly.", icon: Layout },
                { step: "02", title: "AI Generates Your Plan", desc: "Our RAG engine processes the text and instantly crafts a personalized schedule.", icon: Zap },
                { step: "03", title: "Study & Take Quizzes", desc: "Work through adaptive mock tests that target your specific weak spots.", icon: Brain },
                { step: "04", title: "Review & Master", desc: "Leverage spaced repetition algorithms until you achieve full topic mastery.", icon: CheckCircle },
              ].map((item, idx) => (
                <div key={idx} ref={el => stepsRef.current[idx] = el} className="relative pl-20 group">
                  <div className="absolute left-0 top-1 w-14 h-14 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:border-[#3B3BF9] group-hover:text-[#3B3BF9] group-hover:shadow-lg transition-all duration-300 z-10">
                    <item.icon size={22} className="group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-sm font-bold text-[#F97316] mb-1 tracking-wider">STEP {item.step}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 pb-4">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Images Right Side */}
            <div className="relative h-[600px] hidden lg:block perspective-1000">
              <div className="hiw-parallax-fast absolute right-0 top-10 w-[85%] aspect-square bg-gradient-to-tr from-[#3B3BF9] to-purple-500 rounded-3xl shadow-2xl p-8 text-white flex flex-col justify-between">
                <div className="font-bold text-2xl opacity-80">AI Knowledge Graph</div>
                <Brain size={120} className="opacity-20 self-end" />
              </div>
              <div className="hiw-parallax-slow absolute left-0 bottom-20 w-[70%] aspect-video bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-6 z-10">
                <div className="flex justify-between items-center mb-6">
                  <div className="bg-gray-100 w-32 h-4 rounded-full" />
                  <div className="bg-[#F97316]/20 text-[#F97316] px-3 py-1 rounded-full text-xs font-bold">Mastered</div>
                </div>
                <div className="w-full h-24 bg-gray-50 rounded-xl flex items-end justify-between p-4 px-8">
                  {[40, 70, 50, 90, 60, 100].map((h, i) => (
                    <div key={i} className="w-6 bg-[#3B3BF9] rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="py-24 px-8 md:px-16 overflow-hidden bg-white">
        <div ref={ctaRef}
          className="max-w-6xl mx-auto bg-[#3B3BF9] rounded-[40px] px-8 py-20 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute -top-[200px] -right-[100px] w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl" />
          <div className="absolute -bottom-[200px] -left-[100px] w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white backdrop-blur text-sm font-medium mb-8 border border-white/20">
              <Sparkles size={14} className="inline mr-2 text-[#F97316]" />
              Start Your Journey
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Transform Your Study Habits?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl">
              Join thousands of students who have upgraded their workflow with StudyBuddy's advanced AI toolset.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link to="/create-plan" className="relative overflow-hidden group bg-white text-[#3B3BF9] font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-white/20 hover:scale-105 transition-all duration-300">
                <span className="relative z-10 flex items-center gap-2">Get Started Free <ArrowRight size={18} /></span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
              </Link>

              <Link to="/pricing" className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-bold hover:bg-white/10 transition-all duration-300">
                See Pricing
              </Link>
            </div>
            <p className="text-sm text-blue-200 mt-6 font-medium">No credit card required • Free forever • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F5F5F7] pt-24 pb-12 px-8 md:px-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-xl text-gray-900 mb-4">
              <div className="w-8 h-8 rounded bg-[#3B3BF9] flex items-center justify-center text-white">
                <BookOpen size={18} />
              </div>
              StudyBuddy
            </div>
            <p className="text-gray-500 mb-6 font-medium leading-relaxed">
              AI-powered document intelligence and studying platform designed for mastery.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-[#3B3BF9] hover:shadow-md transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-900 hover:shadow-md transition-all">
                <Github size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Product</h4>
            <ul className="space-y-4 text-gray-500 font-medium tracking-wide">
              <li><a href="#" className="hover:text-[#3B3BF9] transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-[#3B3BF9] transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-[#3B3BF9] transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-[#3B3BF9] transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-4 text-gray-500 font-medium tracking-wide">
              <li><a href="#" className="hover:text-[#3B3BF9] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#3B3BF9] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#3B3BF9] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#3B3BF9] transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-4 text-gray-500 font-medium tracking-wide">
              <li><a href="/privacy" className="hover:text-[#3B3BF9] transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-[#3B3BF9] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#3B3BF9] transition-colors">Cookie Guideline</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-200 text-center text-gray-400 font-medium text-sm">
          © 2025 StudyBuddy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
