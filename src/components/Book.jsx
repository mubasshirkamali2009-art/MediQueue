import { authClient } from '@/lib/auth-client';
import { Calendar } from 'lucide-react';

const Book = ({ tutor}) => {
    const{data:session} = authClient.useSession();
    const user= session?.user;




    const handleBooking = async() => {
        const bookingData={
            userId: user.id ,
            userImage: user.image ,
            userName: user.name ,
            tutorId: tutor._id ,
            tutorName: tutor.tutorName ,
            userEmail: user.email ,
            tutorImage: tutor.photoUrl
        }
       const res =  await fetch("http://localhost:5000/booking" , {
        method:"POST" ,
        headers: {
          'content-type': 'application/json'
        } ,
        body:JSON.stringify(bookingData)

       })

const data =await res.json();
console.log(data)
    }
  return (
    <button  onClick={handleBooking}
      className="
        group
        w-full sm:w-auto md:w-full
        inline-flex items-center justify-center gap-2
        px-4 py-2 text-sm
        sm:px-6 sm:py-3 sm:text-base
        md:px-8 md:py-2 md:text-lg md:font-semibold
        font-medium text-white
        bg-purple-600
        hover:bg-purple-700
        hover:shadow-lg hover:shadow-purple-400
        hover:-translate-y-0.5
        active:scale-95
        rounded-lg md:rounded-xl
        transition-all duration-200
        cursor-pointer

        
      "
    >
      <Calendar
        className="
          w-4 h-4
          sm:w-5 sm:h-5
          md:w-6 md:h-6
          group-hover:rotate-12
          transition-transform duration-200
        "
      />
      Book Now
    </button>
  );
};

export default Book;