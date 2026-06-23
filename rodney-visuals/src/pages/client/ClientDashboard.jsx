import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";
import { 
  Download, CheckCircle, Clock, Phone, MessageCircle, X 
} from "lucide-react";

export default function ClientDashboard() {
  const { slug } = useParams();
  const [client, setClient] = useState(null);
  const [modal, setModal] = useState(null);

  const fetchPortal = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/clients/portal/${slug}`);
      setClient(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPortal();
  }, []);

  const handleContactClick = (type) => {
    setModal({ type });
  };

  const confirmAction = () => {
    if (modal?.type === 'call') {
      window.location.href = 'tel:+1234567890'; // Replace with real number
    } else if (modal?.type === 'whatsapp') {
      window.open('https://wa.me/1234567890', '_blank'); // Replace with real number
    }
    setModal(null);
  };

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
        Loading your portal...
      </div>
    );
  }

  const milestones = [
    { id: 1, label: "Booking Confirmed" },
    { id: 2, label: "Coverage Complete" },
    { id: 3, label: "Editing in Progress" },
    { id: 4, label: "Ready for Delivery" },
  ];

  const statusMap = {
  "Booked": 0,
  "Coverage Complete": 1,
  "Editing": 2,
  "Ready For Delivery": 3,
  "Delivered": 4,
};

const currentStepIndex =
  statusMap[client.status] ?? 0;

  const progressPercentage =
  client.status === "Delivered"
    ? 100
    : ((currentStepIndex + 1) /
        milestones.length) *
      100;

  return (
    <div className="min-h-screen bg-[#080808] text-white pb-16">
      {/* Mini Hero - Left Aligned */}
      <div className="relative h-[380px] sm:h-[420px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-[#080808]" />
        <img
          src={client.coverImage || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc"}
          alt={client.projectName}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 flex items-center px-6 sm:px-8 z-10">
          <div className="max-w-4xl w-full text-left">

            {/* 1. Client Portal Badge */}
            <div className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur-md text-[#d8b88a] text-sm mb-4">
              Client Portal
            </div>

            {/* 2. Greeting Message */}
            <p className="text-white/80 text-2xl sm:text-3xl mb-3">
              Hello, {client.name}
            </p>

            {/* 3. Project Title */}
            <h1 className="text-5xl sm:text-6xl font-serif tracking-tighter leading-none mb-8">
              {client.projectName}
            </h1>

            {/* Contact Icons */}
            <div className="flex gap-4">
              <button
                onClick={() => handleContactClick('call')}
                className="w-14 h-14 bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 duration-200"
              >
                <Phone size={24} className="text-[#d8b88a]" />
              </button>

              <button
                onClick={() => handleContactClick('whatsapp')}
                className="w-14 h-14 bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 duration-200"
              >
                <MessageCircle size={24} className="text-[#d8b88a]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 mt-10 relative z-10 space-y-14">

        {/* Progress Section */}
        <div>
          <div className="flex justify-between items-baseline mb-6">
            <h3 className="text-2xl font-medium">Project Journey</h3>
            <div className="px-5 py-2 bg-white/5 rounded-full text-[#d8b88a] text-sm font-medium">
              {client.status}
            </div>
          </div>

          <div className="h-3 bg-white/10 rounded-3xl overflow-hidden mb-9">
            <div
              className="h-full bg-gradient-to-r from-[#d8b88a] via-amber-400 to-yellow-300 rounded-3xl transition-all duration-700"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="grid grid-cols-2 md:flex md:justify-between gap-y-10 relative">
            {milestones.map((milestone, index) => {
              const isCompleted =
                client.status === "Delivered"
                  ? true
                  : index <= currentStepIndex;
              const isActive = index === currentStepIndex;

              return (
                <div key={milestone.id} className="flex flex-col items-center text-center relative md:w-auto">
                  <div className={`w-11 h-11 flex items-center justify-center rounded-2xl border-2 mb-4 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-[#d8b88a] border-[#d8b88a] text-black shadow-lg' 
                      : isActive 
                        ? 'border-[#d8b88a] bg-white/10 scale-110 ring-2 ring-[#d8b88a]/30' 
                        : 'border-white/20'}`}>
                    {isCompleted ? <CheckCircle size={26} /> : milestone.id}
                  </div>
                  <p className={`text-sm font-medium transition-colors ${isActive || isCompleted ? "text-white" : "text-white/50"}`}>
                    {milestone.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Downloads Section */}
        <div className="bg-white/5 border border-white/10 rounded-3xl pt-8 pb-6">
          <div className="px-8 flex items-center justify-between mb-8">
            <h3 className="text-2xl font-medium">Your Downloads</h3>
            <Download size={28} className="text-[#d8b88a]" />
          </div>

          {client.status === "Delivered" || (client.files?.length > 0) ? (
            <div className="px-8 space-y-4">
              {/* Files will go here */}
            </div>
          ) : (
            <div className="mx-8 bg-black/60 border border-dashed border-white/30 rounded-3xl py-16 text-center">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-7">
                <Download size={48} className="text-white/40" />
              </div>
              <h4 className="text-2xl font-medium">Files coming soon</h4>
              <p className="text-white/65 mt-3 max-w-md mx-auto px-4">
                Your high-resolution photos and videos will appear here once editing is finalized.
              </p>
              <div className="mt-8 inline-flex items-center gap-2.5 text-sm text-white/60">
                <Clock size={20} />
                <span>Expected: {client.expectedDelivery || "Early next week"}</span>
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-white/40 text-xs pt-8">
          Powered by Nova Media • Thank you for trusting us with your story
        </div>
      </div>

      {/* Confirmation Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-3xl max-w-sm w-full p-8 text-center relative">
            <button
              onClick={() => setModal(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X size={24} />
            </button>

            <div className="mx-auto w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              {modal.type === 'call' ? <Phone size={32} className="text-[#d8b88a]" /> : <MessageCircle size={32} className="text-[#d8b88a]" />}
            </div>

            <h3 className="text-2xl font-medium mb-2">
              {modal.type === 'call' ? 'Call Our Team' : 'Open WhatsApp'}
            </h3>
            <p className="text-white/70 mb-8">
              {modal.type === 'call' 
                ? 'Would you like to call our team now?' 
                : 'Would you like to message us on WhatsApp?'}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-4 rounded-2xl border border-white/20 hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="flex-1 py-4 rounded-2xl bg-[#d8b88a] text-black font-medium hover:bg-amber-400 transition"
              >
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}