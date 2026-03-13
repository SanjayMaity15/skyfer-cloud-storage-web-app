
import { RATING_LENGTH } from '../../constant/constant'
import { FaStar } from 'react-icons/fa'
import { CiStar } from 'react-icons/ci'

const Rating = ({ rating }) => {


  return (
      <div className='flex mt-4'>
          {
              Array.from({ length: RATING_LENGTH }).map((_, index) => {
                  return (
						<div key={index}>
							{index < rating ? (
								<FaStar className="text-yellow-400" />
							) : (
								<CiStar />
							)}
						</div>
					);
              })
          }
    </div>
  )
}

export default Rating