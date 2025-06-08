import { FaUsers, FaComments, FaLock, FaSyncAlt } from 'react-icons/fa';
import { MdGroups } from "react-icons/md";
import { IoChatbubblesOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { FiRefreshCw } from "react-icons/fi";


const FeatureSection = () => {

    const features = [
        {
            icon: <MdGroups className='text-7xl' />,
            title: 'Create & Join Rooms',
            description: 'Spin up your own room or join existing ones in seconds — ideal for teams, friends, or communities.',
        },
        {
            icon: <IoChatbubblesOutline className='text-7xl' />,
            title: 'Real-Time Chat',
            description: 'Communicate seamlessly with live messaging that keeps everyone in sync.',
        },
        {
            icon: <CiLock className='text-7xl' />,
            title: 'Private & Public Rooms',
            description: 'Host open chats or create private, invite-only spaces — your room, your rules.',
        },
        {
            icon: <FiRefreshCw className='text-7xl' />,
            title: 'Persistent Rooms',
            description: 'Rejoin rooms anytime with chat history and shared content saved securely.',
        },
    ];

    return (
        <section>
            <div>
                <h2 className='text-3xl font-semibold text-center'>Features</h2>
                <p className='text-center m-2'>Everything you need to stay connected and collaborate - in real time.</p>
                <div className='grid grid-cols-2 px-2 py-10'>
                    {features.map((feature, index) => (
                        <div key={index} className=' my-5 mx-2 hover:bg-gray-100 p-2'>
                            <div className='mb-2 flex justify-center items-center '>
                                {feature.icon}
                            </div>
                            <h3 className='text-center mb-2'>{feature.title}</h3>
                            <p className='text-center'>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeatureSection;
