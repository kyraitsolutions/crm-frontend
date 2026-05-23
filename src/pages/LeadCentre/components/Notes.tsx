import { Clock, Link } from 'lucide-react';
import { useState } from 'react'

const Notes = ({ notes: initialNotes }: { notes: any[] }) => {
    const [showNoteEditor, setShowNoteEditor] = useState(false);
    const [noteTitle, setNoteTitle] = useState("");
    const [showNotes, setShowNotes] = useState(true);
    // const [notes, setNotes] = useState(initialNotes);
    // const [notes, setNotes] = useState([
    //     {

    //         id: 1,
    //         title: "gfhfg",
    //         createdBy: "Abhijeet Singh",
    //         time: "now",
    //     },
    //     {
    //         id: 2,
    //         title: "dfhfghfg",
    //         createdBy: "Abhijeet Singh",
    //         time: "now",
    //     },
    // ]);

    const handleSaveNote = () => {
        if (!noteTitle.trim()) return;

        const newNote = {
            id: Date.now(),
            title: noteTitle,
            createdBy: "Abhijeet Singh",
            time: "now",
        };

        // setNotes((prev) => [newNote, ...prev]);
        setNoteTitle("");
        setShowNoteEditor(false);
    };

    console.log("Notes", initialNotes)
    return (
        <div className="bg-white rounded-xl overflow-hidden">
            {/* Header */}
            <div onClick={() => { setShowNotes((prev) => !prev) }} className={`flex cursor-pointer items-center justify-between px-5 py-2.5 ${showNotes && "border-b"} border-[#e5e7eb]`}>
                <div className='flex justify-between items-center max-w-4xl w-full'>

                    <h2 className="font-semibold text-md ">
                        Notes
                    </h2>

                    <select onClick={(e) => e.stopPropagation()} className="border border-second font-medium rounded-xl px-4 py-1 text-sm bg-second/10 text-second outline-none  hover:bg-second/20">
                        Recent Last ▾

                        <option value="recent_first" >Recent First</option>
                        <option value="recent_last" >Recent Last</option>
                    </select>
                </div>

            </div>

            {showNotes && <div className="p-5">
                {/* Existing Notes */}
                <div className="space-y-7 mb-5">
                    {initialNotes.map((note) => (
                        <div
                            key={note._id}
                            className="flex gap-4"
                        >
                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium text-md shrink-0">
                                {note?.createdBy?.charAt(0)}
                            </div>
                            <div className="flex flex-col gap-2">
                                {/* Avatar */}

                                <div className='capitalize text-xs text-gray-600 bg-gray-200 w-fit px-2 py-1 rounded-xl flex items-center gap-2'>
                                    <span>Had conversation on</span> {note.activitySource}
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 className="text-sm font-medium capitalize">
                                        {note.message}
                                    </h3>

                                    <div className="flex items-center gap-2 text-sm text-[#5b6b82] flex-wrap">
                                        <span>Lead</span>

                                        <span className="text-[#4f46e5] cursor-pointer hover:underline">
                                            Yvonne Tjepkema (Sa...
                                        </span>

                                        <span>•</span>

                                        <span>Add Note</span>

                                        <span>•</span>

                                        <span><Clock size={14} /></span>

                                        <span>{note.time}</span>

                                        <span>by {note.createdBy}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Add Note Button */}
                {!showNoteEditor && (
                    <button
                        onClick={() => setShowNoteEditor(true)}
                        className="w-full border border-[#cfd6e4] rounded-xl max-w-4xl px-5 py-2.5 text-left text-[#8a94a6] hover:border-[#aeb8ca]"
                    >
                        Add a note
                    </button>
                )}

                {/* Note Editor */}
                {showNoteEditor && (
                    <div className="border border-second rounded-xl max-w-4xl overflow-hidden shadow-sm">
                        {/* Textarea */}
                        <div className="p-4">
                            <label className="block text-[#8b95a7] font-medium mb-3">
                                Title
                            </label>

                            <textarea
                                value={noteTitle}
                                onChange={(e) => setNoteTitle(e.target.value)}
                                className="w-full min-h-20 resize-none outline-none text-md"
                                placeholder="Write your note..."
                            />
                        </div>

                        {/* Footer */}
                        <div className="border-t bg-[#f8f9fc] px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-4 text-gray-700">
                                <button className="text-lg font-serif">
                                    T
                                </button>

                                <button className="text-lg">
                                    <Link size={16} />
                                </button>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowNoteEditor(false);
                                        setNoteTitle("");
                                    }}
                                    className="border px-4 py-1 rounded text-[#374151] hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSaveNote}
                                    className="bg-second text-white px-5 py-1 rounded hover:bg-second/90 cursor-pointer"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>}
        </div>
    )
}

export default Notes