import Image from "next/image";
import { HostRouteTester } from "@/app/components/HostRouteTester";

export default function HomePage() {
  return (
    <main>
      <h1>HubFly Next.js Testing Template</h1>

      <section className="card">
        <h2>Image Optimization Sample</h2>
        <p>This image is served with Next.js Image Optimization.</p>
        <Image
          src="/images/sample.jpg"
          alt="Template sample"
          width={640}
          height={360}
          priority
        />
      </section>

      <section className="card">
        <h2>API Route Samples</h2>
        <p>GET health route:</p>
        <code>/api/health</code>
        <p>POST echo route:</p>
        <code>/api/echo</code>
      </section>

      <HostRouteTester />
    </main>
  );
}
