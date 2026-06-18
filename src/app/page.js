import Footer from "@/components/Footer";
import HomeContent from "@/components/HomeContent";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";


export default function Home() {
  return (
<div>

<Suspense fallback={<div>Loading...</div>}>
<HomeContent/>
</Suspense>

</div>
  );
}
