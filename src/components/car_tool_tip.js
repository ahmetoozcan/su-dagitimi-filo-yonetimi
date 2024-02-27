const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const { tarih, maliyet, açıklama } = payload[0].payload;  // Access additional data as needed
        return (
            <div className="custom-tooltip">
                <p>Date: {tarih}</p>
                <p>Cost: {maliyet}</p>
                <p>Brief: {açıklama}</p>
            </div>
        );
    }
    return null;
};

export default CustomTooltip;