import EnhancedTable, { Column, RowAction } from '../../components/table/EnhancedTable';
import React, { useEffect, useState } from 'react';
import StandardPage from '../../components/StandardPage';
import axios from 'axios';

interface MissionEntry {
    id: string;
    name: string;
    pack: string;
    packURL: string;
}

export default function MissionsPage(): JSX.Element {
    const [missionData, setMissionData] = useState<MissionEntry[]>([]);

    const columns: Column<MissionEntry>[] = [
        {
            align: 'left',
            id: 'name',
            label: 'Mission Name',
            width: '35%',
        },
        {
            align: 'left',
            id: 'pack',
            label: 'Pack Name',
            width: '35%',
        },
    ];

    useEffect(() => {
        axios
            // .get(`${process.env.API_URL}/missions`)
            .get('http://localhost:4000/api/v1/missions')
            .then(({ data }) => {
                setMissionData(
                    data.map(
                        (mission: {
                            missionId: string;
                            name: string;
                            pack: { name: string; workshopURL: string };
                        }) => ({
                            id: mission.missionId,
                            name: mission.name,
                            pack: mission.pack.name,
                            packURL: mission.pack.workshopURL,
                        })
                    )
                );
            })
            .catch((err) => {
                //TODO: error
                console.log(err);
            });
    }, []);

    const rowActions: RowAction<MissionEntry>[] = [
        {
            label: 'Open Mission',
            color: 'primary',
            references: 'id',
            action: (event, val) => alert(val),
        },
        {
            label: 'Open Pack',
            color: 'secondary',
            references: 'packURL',
            action: (event, val) => alert(val),
        },
    ];

    return (
        <StandardPage title="Missions">
            <EnhancedTable<MissionEntry>
                disableSelection
                order="asc"
                orderBy="name"
                rows={missionData}
                columns={columns}
                rowActions={rowActions}
            />
        </StandardPage>
    );
}
