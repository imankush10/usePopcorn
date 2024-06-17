import { useEffect, useState } from "react";

export function useLocalStorageState(){
    const [watched, setWatched] = useState(() =>
        JSON.parse(localStorage.getItem("watched"))
      );
    useEffect(() => {
        localStorage.setItem("watched", JSON.stringify(watched));
      }, [watched]);
      return [watched, setWatched];
}