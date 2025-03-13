import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateStream, fetchStream } from "../api/stream";
import Orchestra from "../components/controls/Orchestra";
import Venue from "../components/controls/Venue";


export default function StreamEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [stream, setStream] = useState({
        title: "",
        description: "",
        endDate: "",
        sh_order: "",
        venueDimensions: { width: 0, height: 0 },
        venueImage: "",
        venueName: "",
        orchestraImage: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadStream = async () => {
            try {
                const data = await fetchStream(id);
                if (data.venueDimensions === undefined) {
                    data.venueDimensions = { width: 0, height: 0 }
                }
                setStream(data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load stream.");
                setLoading(false);
            }
        };
        loadStream();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await updateStream(id, stream);
        } catch (err) {
            setError("Failed to update stream.");
        }
    };

    const handleChange = (e) => {
        setStream({ ...stream, [e.target.name]: e.target.value });
    };

    const handleDimensionChange = (e) => {
        setStream({
            ...stream,
            venueDimensions: {
                ...stream.venueDimensions,
                [e.target.name]: e.target.value,
            },
        });
    };


    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Edit Stream</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Title</label>
                    <input type="text" name="title" value={stream.title} onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md" required />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Description</label>
                    <textarea name="description" value={stream.description} onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md" rows="3" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">End Date</label>
                    <input type="date" name="endDate" value={stream.endDate} onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Stream Order</label>
                    <input type="number" name="sh_order" value={stream.sh_order} onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md" />
                </div>

                <div className="flex gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Venue Width</label>
                        <input type="number" name="width" value={stream.venueDimensions.width} onChange={handleDimensionChange}
                            className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Venue Height</label>
                        <input type="number" name="height" value={stream.venueDimensions.height} onChange={handleDimensionChange}
                            className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Venue Name</label>
                    <input type="text" name="venueName" value={stream.venueName} onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                {/* Submit */}
                <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">
                        Update Stream
                    </button>
                </div>
            </form>
            <div className="flex flex-col gap-4 mt-8">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Edit Orchestra</h2>
                    <Orchestra editable={true} />
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Edit Venue</h2>
                    <Venue editable={true} />
                </div>
            </div>
        </div>
    );
}
