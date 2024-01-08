const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const { tarih, maliyet, açıklama } = payload[0].payload;  // Access additional data as needed
        return (
            <div className="custom-tooltip">
                <p>Tarih: {tarih}</p>
                <p>Maliyet: {maliyet}</p>
                <p>Açıklama: {açıklama}</p>
                {/* Display other information as needed */}
            </div>
        );
    }
    return null;
};

export default CustomTooltip;