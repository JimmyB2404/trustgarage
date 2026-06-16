import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="text-[72px] font-serif text-neutral-100 font-normal select-none">404</div>
        <h1 className="text-[24px] font-serif text-neutral-900 mt-2">Pagina niet gevonden</h1>
        <p className="text-[15px] text-neutral-500 mt-3 max-w-[360px]">
          De pagina die u zoekt bestaat niet of is verplaatst.
        </p>
        <Link href="/" className="btn-primary mt-8">
          Terug naar home
        </Link>
      </div>
      <Footer />
    </>
  )
}
