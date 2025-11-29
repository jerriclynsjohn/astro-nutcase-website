import { Header } from "@/components/header"
import { ScrollGallery } from "@/components/scroll-gallery"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <ScrollGallery />
      <Footer />
    </main>
  )
}
