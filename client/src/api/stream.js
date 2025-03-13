/**
 * Fetch all streams
 */
export async function fetchAllStreams() {
    try {
      const response = await fetch("/stream");
      if (!response.ok) throw new Error("Failed to fetch streams");
      return await response.json();
    } catch (error) {
      console.error("Error fetching streams:", error);
      return [];
    }
  }
  
  /**
   * Fetch a single stream by ID
   */
  export async function fetchStream(id) {
    try {
      const response = await fetch(`/stream/${id}/stream`);
      if (!response.ok) throw new Error("Failed to fetch stream data");
      return await response.json();
    } catch (error) {
      console.error("Error fetching stream:", error);
      return null;
    }
  }
  
  /**
   * Create a new stream
   */
  export async function createStream(streamData) {
    try {
      const response = await fetch("/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(streamData),
      });
      if (!response.ok) throw new Error("Failed to create stream");
      return await response.json(); // Usually returns { id: newStreamId }
    } catch (error) {
      console.error("Error creating stream:", error);
      return null;
    }
  }
  
  /**
   * Update an existing stream (title, description, sh_order, etc.)
   */
  export async function updateStream(id, updates) {
    try {
      const response = await fetch(`/stream/${id}/stream`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update stream");
      return await response.json();
    } catch (error) {
      console.error("Error updating stream:", error);
      return null;
    }
  }
  
  /**
   * End a stream (set the endDate)
   */
  export async function endStream(id, endDate = null) {
    try {
      const response = await fetch(`/stream/${id}/stream/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endDate }),
      });
      if (!response.ok) throw new Error("Failed to end stream");
      return await response.json();
    } catch (error) {
      console.error("Error ending stream:", error);
      return null;
    }
  }
  
  /**
   * Delete a stream by ID
   */
  export async function deleteStream(id) {
    try {
      const response = await fetch(`/stream/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete stream");
      return true;
    } catch (error) {
      console.error("Error deleting stream:", error);
      return false;
    }
  }
  
  /**
   * Fetch all instruments for a stream
   */
  export async function fetchInstruments(id) {
    try {
      const response = await fetch(`/stream/${id}/instruments`);
      if (!response.ok) throw new Error("Failed to fetch instruments");
      return await response.json();
    } catch (error) {
      console.error("Error fetching instruments:", error);
      return [];
    }
  }
  
  /**
   * Update instruments of a stream
   */
  export async function updateInstruments(id, instruments) {
    try {
      const response = await fetch(`/stream/${id}/instruments`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruments }),
      });
      if (!response.ok) throw new Error("Failed to update instruments");
      return await response.json();
    } catch (error) {
      console.error("Error updating instruments:", error);
      return null;
    }
  }
  
  /**
   * Fetch all cameras for a stream
   */
  export async function fetchCameras(id) {
    try {
      const response = await fetch(`/stream/${id}/cameras`);
      if (!response.ok) throw new Error("Failed to fetch cameras");
      return await response.json();
    } catch (error) {
      console.error("Error fetching cameras:", error);
      return [];
    }
  }
  
  /**
   * Update cameras of a stream
   * (already in your snippet, included here for completeness)
   */
  export async function updateCameras(id, cameras) {
    try {
      const response = await fetch(`/stream/${id}/cameras`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cameras }),
      });
      if (!response.ok) throw new Error("Failed to update cameras");
      return await response.json();
    } catch (error) {
      console.error("Error updating cameras", error);
      return null;
    }
  }
  
  /**
   * Update the venue (name, dimensions, images, etc.)
   */
  export async function updateVenue(id, venueData) {
    try {
      const response = await fetch(`/stream/${id}/venue`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venueData),
      });
      if (!response.ok) throw new Error("Failed to update venue");
      return await response.json();
    } catch (error) {
      console.error("Error updating venue:", error);
      return null;
    }
  }
  
  /**
   * Fetch HRTFs for a stream
   */
  export async function fetchStreamHRTFs(id) {
    try {
      const response = await fetch(`/stream/${id}/hrtfs`);
      if (!response.ok) throw new Error("Failed to fetch HRTFs");
      return await response.json();
    } catch (error) {
      console.error("Error fetching HRTFs:", error);
      return [];
    }
  }
  
  /**
   * Fetch Ambisonics HRTFs for a stream
   */
  export async function fetchStreamAmbiHRTFs(id) {
    try {
      const response = await fetch(`/stream/${id}/ambiHrtfs`);
      if (!response.ok) throw new Error("Failed to fetch ambiHRTFs");
      return await response.json();
    } catch (error) {
      console.error("Error fetching ambiHRTFs:", error);
      return [];
    }
  }
  
  /**
   * Rotate HRTFs by specified rotation angle
   */
  export async function rotateHRTFs(id, rotation) {
    try {
      const response = await fetch(`/stream/${id}/hrtfs/${rotation}`);
      if (!response.ok) throw new Error("Failed to rotate HRTFs");
      return await response.json();
    } catch (error) {
      console.error("Error rotating HRTFs:", error);
      return [];
    }
  }
  