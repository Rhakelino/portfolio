import React, { useEffect, useState } from "react"
import './App.css'
import { FaGithub } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

function App() {

  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Cek preferensi tema dari localStorage
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    // Terapkan kelas 'dark' ke elemen root berdasarkan state
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (

    <div className="flex flex-col dark:bg-[#1A103D]">
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
        }}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Hi I'm <br /> Almalikul Mulki Rhakelino</h1>
            <p className="mb-5 text-white opacity-80">
              I am a passionate web developer with a love for creating innovative and user-friendly experiences. My journey in the tech world has allowed me to work on various exciting projects, and I am always eager to learn and improve.
            </p>

            <a href="/files/CV_AlmalikulMulkiRhakelino.pdf" download className="btn btn-primary">Download CV</a>
          </div>
        </div>
      </div>


      {/* Togel Darkmode */}
      <div className="relative">
        {/* Swap toggle for theme */}
        <label className="swap swap-rotate fixed top-4 right-4 z-50">
          {/* Hidden checkbox */}
          <input type="checkbox" className="theme-controller" value="synthwave" onChange={handleToggle} />

          {/* Sun icon */}
          <svg
            className="swap-off h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          {/* Moon icon */}
          <svg
            className="swap-on h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>

        {/* Rest of your website content */}
      </div>
      {/* End TOgel Darkmode */}


      {/* Project Section */}
      <div className="flex flex-col m-10">
        <h1 className="text-3xl font-semibold mb-4">My Projects</h1>
        <p className="mb-8">Check out some of the projects I've worked on here</p>
        {/* Quran */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="flex w-full md:w-2/5">
            <img src="./images/quran.png" className="object-cover w-full h-auto rounded-lg shadow-md" />
          </div>
          <div className="flex flex-col w-full md:w-3/5">
            <h2 className="text-xl font-semibold mb-3">Quran Juju - Al Quran Berbasis Web</h2>
            <p className="text-gray-400 mb-2 opacity-80">
              Quran Juju adalah sebuah aplikasi web Al Quran yang dirancang untuk memudahkan pengguna dalam membaca dan mendengarkan bacaan setiap ayat. Dengan fitur lengkap yang mencakup teks Al Quran dan audio bacaan dari qari terkenal.
            </p>
            <div className="flex gap-1 mb-3">
              <button className="btn-sm rounded-md bg-base-200 dark:bg-transparent dark:border ">React</button>
              <button className="btn-sm rounded-md bg-base-200 dark:bg-transparent dark:border">Javascript</button>
              <button className="btn-sm rounded-md bg-base-200 dark:bg-transparent dark:border">Tailwind</button>
            </div>
            <div className="flex gap-3">
              <div className="flex">
                <a href="https://github.com/Rhakelino/alquran-digital" target="_blank" className="btn btn-sm btn-outline btn-accent">
                  <FaGithub className="text-xl" />
                  Github Repo
                </a>
              </div>
              <a href="https://al-qurran.netlify.app/" target="_blank" className="btn btn-sm btn-primary">  <FaEye className="text-xl" />Live Preview</a>
            </div>
          </div>
        </div>
        {/* End Quran */}
        {/* Anime */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="flex w-full md:w-2/5">
            <img src="./images/anime2.png" className="object-cover w-full h-auto rounded-lg shadow-md" />
          </div>
          <div className="flex flex-col w-full md:w-3/5">
            <h2 className="text-xl font-semibold mb-3">Juju Otaku - Website Pencarian Anime</h2>
            <p className="text-gray-400 mb-2 opacity-80">
              Juju Otaku adalah situs web yang memungkinkan pengguna untuk mencari berbagai anime dan mendapatkan informasi lengkap tentang setiap anime yang mereka temui.
            </p>
            <div className="flex gap-1 mb-3 flex-wrap">
              <button className="btn-sm rounded-md bg-base-200 dark:bg-transparent dark:border">React</button>
              <button className="btn-sm rounded-md bg-base-200 dark:bg-transparent dark:border">Javascript</button>
              <button className="btn-sm rounded-md bg-base-200 dark:bg-transparent dark:border">Tailwind</button>
              <button className="btn-sm rounded-md bg-base-200 dark:bg-transparent dark:border">Daisy UI</button>
            </div>
            <div className="flex gap-3">
              <a href="https://github.com/Rhakelino/juju-otaku" target="_blank" className="btn btn-sm btn-outline btn-accent">
                <FaGithub className="text-xl" />
                Github Repo
              </a>
              <a href="https://juju-otaku.netlify.app/" target="_blank" className="btn btn-sm btn-primary">
                <FaEye className="text-xl" />
                Live Preview
              </a>
            </div>
          </div>
        </div>
        {/* End Anime */}

        {/* Juju News */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex w-full md:w-2/5">
            <img src="./images/juju-news.png" className="object-cover w-full h-auto rounded-lg shadow-md" />
          </div>
          <div className="flex flex-col w-full md:w-3/5">
            <h2 className="text-xl font-semibold mb-3">Juju News - Website Baca Berita</h2>
            <p className="text-gray-400 mb-2 opacity-80">
            Juju News adalah situs web yang menyediakan berita terkini dari berbagai kategori, mulai dari teknologi, hiburan, hingga olahraga. Pengguna dapat dengan cepat mengakses berita terbaru dan informasi yang relevan.
            </p>
            <div className="flex gap-1 mb-3 flex-wrap">
              <button className="btn-sm rounded-md bg-base-200 dark:bg-transparent dark:border">React</button>
              <button className="btn-sm rounded-md bg-base-200 dark:bg-transparent dark:border">Javascript</button>
              <button className="btn-sm rounded-md bg-base-200 dark:bg-transparent dark:border">Tailwind</button>
              <button className="btn-sm rounded-md bg-base-200 dark:bg-transparent dark:border">Daisy UI</button>
            </div>
            <div className="flex gap-3">
              <a href="https://github.com/Rhakelino/juju-news" target="_blank" className="btn btn-sm btn-outline btn-accent">
                <FaGithub className="text-xl" />
                Github Repo</a>
              <a href="https://juju-news.netlify.app/" target="_blank" className="btn btn-sm btn-primary">  <FaEye className="text-xl" />Live Preview</a>
            </div>
          </div>
        </div>
        {/* End Juju News */}
      </div>
      {/* End Project Section */}


      {/* SkillSet */}
      <div className="flex flex-col m-10">
        <h1 className="text-3xl font-semibold mb-4">Skillset</h1>
        <p className="mb-8">Here are some of the skills I possess:</p>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="bg-base-200 dark:bg-transparent dark:border image-full rounded-xl shadow-xl h-full flex-1">
            <div className="card-body">
              <h2 className="card-title">Frontend</h2>
              <p className="opacity-80">I have created a visually appealing website that emphasizes beauty</p>
              <div className="flex gap-2 flex-wrap">
                <div className="relative group">
                  <img src="./images/html.svg" width={40} />
                  <div className="absolute top-[-20px] left-0 right-0 flex items-center justify-center bg-base-300 bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Html</span>
                  </div>
                </div>
                <div className="relative group">
                  <img src="./images/css.svg" width={40} />
                  <div className="absolute top-[-20px] left-0 right-0 flex items-center justify-center bg-base-300 bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Css</span>
                  </div>
                </div>
                <div className="relative group">
                  <img src="./images/js.svg" width={40} />
                  <div className="absolute top-[-20px] left-0 right-0 flex items-center justify-center bg-base-300 bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Javascript</span>
                  </div>
                </div>
                <div className="relative group">
                  <img src="./images/tailwind.svg" width={40} />
                  <div className="absolute top-[-20px] left-0 right-0 flex items-center justify-center bg-base-300 bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Tailwind</span>
                  </div>
                </div>
                <div className="relative group">
                  <img src="./images/react.svg" width={40} />
                  <div className="absolute top-[-20px] left-0 right-0 flex items-center justify-center bg-base-300 bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>React</span>
                  </div>
                </div>
                <div className="relative group">
                  <img src="./images/bs.svg" width={40} />
                  <div className="absolute top-[-20px] left-0 right-0 flex items-center justify-center bg-base-300 bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Boostrap</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-base-200 rounded-xl dark:bg-transparent dark:border image-full shadow-xl h-full flex-1">
            <div className="card-body">
              <h2 className="card-title">Mobile</h2>
              <p className="opacity-80">I have developed a mobile application that is responsive and user-friendly</p>
              <div className="flex gap-2 flex-wrap">
                <div className="relative group">
                  <img src="./images/native.svg" width={40} />
                  <div className="absolute top-[-50px] left-0 right-0 flex items-center justify-center bg-base-300 bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>React Native</span>
                  </div>
                </div>
                <div className="relative group">
                  <img src="./images/expo.svg" width={34} />
                  <div className="absolute top-[-20px] left-0 right-0 flex items-center justify-center bg-base-300 bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Expo</span>
                  </div>
                </div>
                <div className="relative group">
                  <img src="./images/tailwind.svg" width={40} />
                  <div className="absolute top-[-20px] left-0 right-0 flex items-center justify-center bg-base-300 bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Tailwind</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-base-200 rounded-xl dark:bg-transparent dark:border image-full shadow-xl h-full flex-1">
            <div className="card-body">
              <h2 className="card-title">Backend</h2>
              <p className="opacity-80">I am creating a website using several databases and other technologies.</p>
              <div className="flex gap-2 flex-wrap">
                <div className="relative group">
                  <img src="./images/php.svg" width={40} />
                  <div className="absolute top-[-20px] left-0 right-0 flex items-center justify-center bg-base-300 bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>PHP</span>
                  </div>
                </div>
                <div className="relative group">
                  <img src="./images/mysql.svg" width={40} />
                  <div className="absolute top-[-20px] left-0 right-0 flex items-center justify-center bg-base-300 bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>MySQL</span>
                  </div>
                </div>
                <div className="relative group">
                  <img src="./images/node.svg" width={40} />
                  <div className="absolute top-[-20px] left-0 right-0 flex items-center justify-center bg-base-300 bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Node.js</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* End SkillSet */}



      {/* My certificates */}
      <div className="flex flex-col m-10">
        <h1 className="text-3xl font-semibold mb-4">Certificates</h1>
        <p className="mb-8">Here are some certifications I have acquired:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Belajar Dasar Pemrograman Web */}
          <div className="bg-base-200 rounded-xl dark:bg-transparent dark:border lg:card-side shadow-xl">
            <figure>
              <img
                src="./images/web.png"
                alt="Album" />
            </figure>
            <div className="card-body text-center">
              <h2 className="card-title mx-auto">Belajar Dasar Pemrograman Web</h2>
              <p className="opacity-80">Dicoding</p>
              <p className="opacity-50 text-sm">14 September 2023</p>
            </div>
          </div>
          {/* End Belajar Dasar Pemrograman Web */}

          {/* Belajar Membuat Frontend Untuk Pemula */}
          <div className="bg-base-200 rounded-xl dark:bg-transparent dark:border lg:card-side shadow-xl">
            <figure>
              <img
                src="./images/frontend.png"
                alt="Album" />
            </figure>
            <div className="card-body text-center">
              <h2 className="card-title mx-auto">Belajar Membuat Frontend </h2>
              <p className="opacity-80">Dicoding</p>
              <p className="opacity-50 text-sm">14 September 2023</p>
            </div>
          </div>
          {/* End Belajar Membuat Frontend Untuk Pemula  */}

        </div>
      </div>
      {/* End My Certificates */}

      {/* Footer */}
      <footer className="footer footer-center bg-base-200 dark:bg-transparent text-base-content p-4">
        <aside>
          <p>Copyright © {new Date().getFullYear()} - All right reserved by ACME Industries Ltd</p>
        </aside>
      </footer>
      {/* End Footer */}
    </div>
  )
}

export default App
