
import { FaUsers, FaComments, FaFileAlt, FaLock, FaSyncAlt, FaUserClock } from 'react-icons/fa';

const features = [
    {
        icon: <FaUsers className="text-blue-600 text-3xl" />,
        title: 'Create & Join Rooms',
        description: 'Spin up your own room or join existing ones in seconds — ideal for teams, friends, or communities.',
    },
    {
        icon: <FaComments className="text-green-600 text-3xl" />,
        title: 'Real-Time Chat',
        description: 'Communicate seamlessly with live messaging that keeps everyone in sync.',
    },
    {
        icon: <FaFileAlt className="text-yellow-500 text-3xl" />,
        title: 'Resource Sharing',
        description: 'Easily share files, links, and notes with everyone in the room.',
    },
    {
        icon: <FaUserClock className="text-indigo-600 text-3xl" />,
        title: 'Live User Presence',
        description: 'Know who’s online, typing, or just joined — like being in the same room.',
    },
    {
        icon: <FaLock className="text-red-500 text-3xl" />,
        title: 'Private & Public Rooms',
        description: 'Host open chats or create private, invite-only spaces — your room, your rules.',
    },
    {
        icon: <FaSyncAlt className="text-purple-500 text-3xl" />,
        title: 'Persistent Rooms',
        description: 'Rejoin rooms anytime with chat history and shared content saved securely.',
    },
];

export default function FeatureSection() {
    return (
        <section className="bg-gray-50 py-12 px-6 md:px-12">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">🚀 Features</h2>
                <p className="text-gray-600 mb-10">Everything you need to stay connected and collaborate — in real time.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

