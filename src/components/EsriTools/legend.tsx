import { getArcgisLegend } from "@/api/resource";
import { LegendModel } from "@/typings/esri";
import { useRequest } from "ahooks";
import React, { useState, useEffect } from "react";

interface LegendProps {
    servers: LegendServer[];
}
export interface LegendServer {
    id: string;
    url: string;
    name: string;
    visible: boolean;
    layers: {
        tch: number;
        visible: boolean;
    }[];
}
export const Legend = (props: LegendProps) => {
    const { servers } = props;
    const visible = servers.reduce((check, item) => check || item.visible, false);
    const { run } = useRequest(getArcgisLegend, { manual: true });
    const [legends, setLegends] = useState<{ id: string; legend: LegendModel }[]>([]);
    useEffect(() => {
        servers.forEach((server) => getLegendInfo(server.id, server.url));
    }, [servers]);
    const getLegendInfo = async (id: string, url: string) => {
        const info = legends.find((item) => item.id === id);
        if (info) {
        } else {
            const legendInfo = await run(url);
            const temp = [...legends];
            temp.push({ legend: legendInfo, id });
            setLegends(temp);
        }
    };
    const getLegendDOM = () => {
        return servers
            .filter((server) => server.visible)
            .map((server) =>
                server.layers.length > 0 ? (
                    <section key={server.id}>
                        <h3>{server.name}</h3>
                        <section>
                            {server.layers
                                .filter((l) => l.visible)
                                .map((l) => {
                                    const info = legends.find((item) => item.id === server.id)?.legend.layers.find((item) => item.layerId === l.tch);
                                    return (
                                        <section key={l.tch}>
                                            <h4>{info?.layerName}</h4>
                                            <ul>
                                                {info?.legend.map((i, index) => (
                                                    <li key={index}>
                                                        <img
                                                            src={`data:${i.contentType};base64,${i.imageData}`}
                                                            alt=""
                                                            width={i.width}
                                                            height={i.height}
                                                        />
                                                        <span>{i.label}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    );
                                })}
                        </section>
                    </section>
                ) : (
                    <section>
                        <h3>{server.name}</h3>
                        <section>
                            {legends
                                .find((item) => item.id === server.id)
                                ?.legend.layers.map((info) => (
                                    <section key={info.layerId}>
                                        <h4>{info?.layerName}</h4>
                                        <ul>
                                            {info?.legend.map((i, index) => (
                                                <li key={index}>
                                                    <img
                                                        src={`data:${i.contentType};base64,${i.imageData}`}
                                                        alt=""
                                                        width={i.width}
                                                        height={i.height}
                                                    />
                                                    <span>{i.label}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                ))}
                        </section>
                    </section>
                )
            );
    };
    return (
        <div className="custom-esri-legend" style={{ display: visible ? 'block' : 'none' }}>
            <div className="esri-blue-title">
                <span>图例</span>
            </div>
            <div className="content">{getLegendDOM()}</div>
        </div>
    );
};
