"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { serverURL } from "@/config";
import "./instrument-selection.scss";

const BASE_URL = `${serverURL}/songs`;

const songURL = (songId: string) => {
  return `https://youtube.com/watch?v=${songId}`;
};

const fetchSong = async (songId: string) => {
  const response = await fetch(`${BASE_URL}/${songId}/`);
  const song = await response.json();
  return song;
};

const loadServerSong = async (songId: string) => {
  const url = songURL(songId);
  await fetch(`${serverURL}/download-and-split?url=${url}`, { method: "POST" });
};

export default function InstrumentSelection() {
  const [showAcordes, setShowAcordes] = useState(false);
  const [showLetra, setShowLetra] = useState(false);
  const [song, setSong] = useState();

  const params = useParams();

  const toggleShowAcordes = () => {
    setShowAcordes(!showAcordes);
  };

  const toggleShowLetra = () => {
    setShowLetra(!showLetra);
  };

  const getSong = async () => {
    const songId = params.songId as string;
    await loadServerSong(songId);
    const song = await fetchSong(songId);
    setSong(song);
  };

  useEffect(() => {
    getSong();
  });

  return (
    <div className="p-10 flex flex-col items-center gap-10">
      <Link href="/home" className="self-start">
        Voltar
      </Link>
      <div className="flex flex-col items-center">
        <Image
          src={"/icons/home.ico"}
          alt="Song Cover"
          width={130}
          height={130}
        />
        <div className="text-2xl font-bold mt-5">Riots</div>
        <div className="text-lg">Stuck In The Sound</div>
      </div>
      <form className="my-20 p-5 flex flex-col rounded-lg bg-gray-100" action="">
        <div className="mb-10 flex items-center justify-between gap-3">
          <label htmlFor="instrument" className="font-extrabold text-2xl">
            Instrumento:
          </label>
          <div>
            <select
              itemID="instrument"
              className="border rounded text-blue-400 text-lg text-center font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="guitarra">Baixo</option>
              <option value="piano">Piano</option>
              <option value="bateria">Percussão</option>
              <option value="bateria">Vocal</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between text-lg font-extrabold">
          <div>Mostrar Acordes:</div>
          <div
            className={`border-2 border-black w-5 h-5 transition-colors bg-transparent duration-300 flex items-center justify-center
            ${showAcordes ? " checked" : ""}`}
            onClick={toggleShowAcordes}></div>
        </div>
        <div className="flex items-center justify-between text-lg font-extrabold">
          <div>Mostrar Letra:</div>
          <div
            className={`border-2 border-black w-5 h-5 transition-colors bg-transparent duration-300 flex items-center justify-center
            ${showLetra ? " checked" : ""}`}
            onClick={toggleShowLetra}></div>
        </div>
      </form>
      <Link className="w-1/2 flex items-center justify-center bg-blue-400 rounded-lg" href={`${params.songId}/play`}>
        <span className="py-1 text-2xl">▶</span>
      </Link>
    </div>
  );
}
