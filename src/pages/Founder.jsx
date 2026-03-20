import { useState } from 'react';
import { CalendarDays, Quote, Sparkles, Target, Trophy } from 'lucide-react';

const impactPoints = [
    'Established Vidya Vikas School in 1992',
    'Built a strong foundation for quality education in the region',
    'Guided the institution toward academic excellence and holistic development',
    'Inspired generations of students to achieve success in various fields',
    'Strengthened values-based learning and disciplined education culture',
];

const timeline = [
    { year: '1992', title: 'Vidya Vikas School was established' },
    { year: 'Growth', title: 'Growth of academic excellence' },
    { year: 'Expansion', title: 'Expansion of facilities and student strength' },
    { year: 'Recognition', title: 'Recognition as a trusted educational institution' },
];

export default function Founder() {
    const [imgSrc, setImgSrc] = useState('/founder.jpeg');

    return (
        <div className="page-wrapper">
            <section className="page-hero">
                <div className="container">
                    <div className="page-hero-content">
                        <div className="page-hero-label">Founder Legacy</div>
                        <h1 className="page-hero-title">Sri Muppalla Subbarao</h1>
                        <p className="page-hero-sub">Founder &amp; Chairman</p>
                        <p className="mx-auto mt-3 max-w-2xl text-[15px] font-semibold text-[rgba(255,255,255,0.88)] sm:text-[16px]">
                            "Empowering generations through quality education since 1992."
                        </p>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <article className="rounded-[24px] border border-[#eadfce] bg-white p-5 shadow-[0_10px_30px_rgba(107,68,41,0.14)] sm:p-7">
                        <div className="flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-7">
                            <div className="w-44 flex-shrink-0 overflow-hidden rounded-2xl border border-[rgba(123,45,53,0.18)] bg-[var(--bg-warm)] shadow-[0_8px_20px_rgba(107,68,41,0.16)] sm:w-52 md:w-56">
                                <img
                                    src={imgSrc}
                                    alt="Sri Muppalla Subbarao"
                                    className="h-auto w-full object-cover"
                                    onError={() => setImgSrc('/founder-placeholder.svg')}
                                    loading="lazy"
                                />
                            </div>

                            <div className="w-full min-w-0">
                                <h2 className="text-[22px] font-extrabold text-[var(--primary)] sm:text-[28px]">
                                    Sri Muppalla Subbarao
                                </h2>
                                <p className="mt-1 text-[15px] font-semibold text-[var(--text-mid)]">Founder &amp; Chairman</p>
                                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--accent-light)] px-3 py-1.5 text-[12px] font-bold text-[var(--accent)]">
                                    <CalendarDays size={14} />
                                    Established: 1992
                                </div>

                                <h3 className="mt-5 text-[20px] font-extrabold text-[var(--primary)] sm:text-[24px]">Introduction</h3>
                                <p className="mt-3 text-[15px] leading-8 text-[var(--text-mid)] sm:text-[16px]">
                                    Sri Muppalla Subbarao, the visionary founder of Vidya Vikas School, established the institution in the year 1992
                                    with a strong commitment to delivering quality education rooted in discipline, values, and academic excellence.
                                </p>
                                <p className="mt-3 text-[15px] leading-8 text-[var(--text-mid)] sm:text-[16px]">
                                    His mission has always been to create an environment where students not only gain knowledge but also develop
                                    character, confidence, and a sense of responsibility toward society.
                                </p>
                            </div>
                        </div>
                    </article>

                    <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
                        <article className="rounded-[24px] border border-[#eadfce] bg-white p-5 shadow-[0_8px_26px_rgba(107,68,41,0.12)] sm:p-7">
                            <h3 className="flex items-center gap-2 text-[22px] font-extrabold text-[var(--primary)] sm:text-[26px]">
                                <Sparkles size={20} />
                                Journey &amp; Background
                            </h3>
                            <p className="mt-3 text-[15px] leading-8 text-[var(--text-mid)] sm:text-[16px]">
                                With a deep passion for education and community development, Sri Muppalla Subbarao laid the foundation of Vidya Vikas
                                School to provide accessible and meaningful education to students from all backgrounds.
                            </p>
                            <p className="mt-3 text-[15px] leading-8 text-[var(--text-mid)] sm:text-[16px]">
                                Over the years, under his leadership and guidance, the institution has grown into a trusted center of learning, known
                                for its consistent academic performance and strong value-based education system.
                            </p>
                        </article>

                        <article className="rounded-[24px] border border-[#eadfce] bg-white p-5 shadow-[0_8px_26px_rgba(107,68,41,0.12)] sm:p-7">
                            <h3 className="flex items-center gap-2 text-[22px] font-extrabold text-[var(--primary)] sm:text-[26px]">
                                <Target size={20} />
                                Vision
                            </h3>
                            <p className="mt-3 text-[15px] leading-8 text-[var(--text-mid)] sm:text-[16px]">
                                His vision is to build an institution that nurtures young minds with knowledge, discipline, and ethical values,
                                preparing them to excel in academics and succeed in life.
                            </p>
                            <p className="mt-3 text-[15px] leading-8 text-[var(--text-mid)] sm:text-[16px]">
                                He believes that education should go beyond textbooks and focus on the overall development of every student.
                            </p>
                        </article>
                    </div>

                    <article className="mt-5 rounded-[24px] border border-[#eadfce] bg-white p-5 shadow-[0_8px_26px_rgba(107,68,41,0.12)] sm:p-7">
                        <h3 className="flex items-center gap-2 text-[22px] font-extrabold text-[var(--primary)] sm:text-[26px]">
                            <Trophy size={20} />
                            Achievements &amp; Impact
                        </h3>
                        <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                            {impactPoints.map((point) => (
                                <li
                                    key={point}
                                    className="rounded-2xl border border-[rgba(139,94,60,0.24)] bg-[#fff9f2] px-4 py-3 text-[14px] leading-7 text-[var(--text-mid)]"
                                >
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="mt-5 rounded-[24px] border border-[#eadfce] bg-white p-5 shadow-[0_8px_26px_rgba(107,68,41,0.12)] sm:p-7">
                        <h3 className="flex items-center gap-2 text-[22px] font-extrabold text-[var(--primary)] sm:text-[26px]">
                            <Quote size={20} />
                            Message from the Founder
                        </h3>
                        <p className="mt-3 rounded-2xl border border-[rgba(123,45,53,0.18)] bg-[var(--accent-light)] p-4 text-[15px] leading-8 text-[var(--text-mid)] sm:p-5 sm:text-[16px]">
                            "Education is the most powerful tool to shape the future of individuals and society. At Vidya Vikas School, we are
                            committed to nurturing young minds with knowledge, discipline, and values that will guide them throughout their lives.
                            <br />
                            <br />
                            Our aim is not just academic success, but to develop responsible, confident, and capable individuals who can contribute
                            positively to the world."
                        </p>
                    </article>

                    <article className="mt-5 rounded-[24px] border border-[#eadfce] bg-white p-5 shadow-[0_8px_26px_rgba(107,68,41,0.12)] sm:p-7">
                        <h3 className="text-[22px] font-extrabold text-[var(--primary)] sm:text-[26px]">Timeline</h3>
                        <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {timeline.map((step) => (
                                <li key={step.title} className="rounded-2xl border border-[#e8d9cc] bg-[#fffaf4] p-4">
                                    <div className="text-[14px] font-bold text-[var(--primary)]">{step.year}</div>
                                    <div className="mt-1 text-[14px] leading-7 text-[var(--text-mid)]">{step.title}</div>
                                </li>
                            ))}
                        </ol>
                    </article>
                </div>
            </section>
        </div>
    );
}
