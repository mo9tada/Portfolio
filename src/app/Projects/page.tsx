import Image from "next/image";

type Projects = {
  image: string;
  name: string;
  stack: string;
  blurb: string;
};

const projects: Projects[] = [
  { image: "/images/floorplan.jpeg", name: "Floorplan Object Detector", stack: "Next.js · Python", blurb: "Developed an object detection system using Template Matchingfor floorplans using Next.js and Python." },
  { image: "/images/mockup.jpeg", name: "Mockup Generator", stack: "Next.js · Three.js", blurb: "Created a tool to generate realistic mockups using 3D rendering techniques with logo importing." },
  { image: "/images/scouts.png", name: "Scouting Platform", stack: "Next.js · React", blurb: "Built a platform for scouting and managing team data with real-time updates." },
];

  export default function Projects() {
    return(
        <div className="relative flex min-h-screen w-full items-center justify-center bg-black px-4 pb-16 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.35),_transparent_45%)]" aria-hidden />
          <div className="relative flex max-w-2xl flex-col items-center gap-6 pt-32 text-center sm:pt-40">
            <p className="p-4 sm:text-5xl font-bold uppercase tracking-[0.5em] text-emerald-300"> My Projects</p>
            <p className="text-base font-normal text-white/80 sm:text-lg">
              Here are some of the projects I've worked on that showcase my skills and experience in web development.
            </p>
                    <section className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
  {projects.map((project) => (
    <article
      key={project.name}
      className="rounded-2xl border border-white/15 bg-white/5 p-4 text-left backdrop-blur"
    >
      <div className="relative mt-3 aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/30">
        <Image
          src={project.image}
          alt={`${project.name} badge`}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <h3 className="mt-2 text-xl font-semibold">{project.name}</h3>
      <p className="text-sm text-white/70">{project.stack}</p>
      <p className="mt-3 text-sm text-white/60">{project.blurb}</p>
    </article>
  ))}
</section>

          </div>
        </div>
    )
}