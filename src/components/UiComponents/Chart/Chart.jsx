import { LineChart, Legend, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function Chart({ data }) {
    return (
        // RESPONSIVE
        <ResponsiveContainer width='100%' className='-ml-6 pt-4 pb-1'>
            <LineChart data={data}>
                {/* SHOW GRID ON CHART */}
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='time' />
                <YAxis />

                {/* SHOW DETAIL AT ANY POINT */}
                <Tooltip />

                {/* NOTICE */}
                <Legend
                    verticalAlign='top'
                    align='right'
                    iconType='line'
                    layout='horizontal'
                    wrapperStyle={{
                        width: 'fit-content',
                        padding: '4px',
                        border: '1px solid #d9e1e4',
                        top: -5,
                        right: 4,
                    }}
                />
                <Line type='monotone' dataKey='pulse' stroke='red' strokeWidth={2} />
                <Line type='monotone' dataKey='spo2' stroke='blue' strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default Chart;
