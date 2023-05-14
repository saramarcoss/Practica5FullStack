import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div>
            <h3> Select an option:
            <br/>
            <Link href="/doctor">
                Doctor 
            </Link>
            <br/>
            <Link href="/patient">
                Patient
            </Link>
            </h3>
        </div>
    </>
  )
}
