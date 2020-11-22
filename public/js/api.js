const BASE_URL = `https://api.football-data.org/v2`;

const status = (response) => {
	if (response.status !== 200) {
		console.log("Error: " + response.status);

		return Promise.reject(new Error(response.statusText));
	} else {
		return Promise.resolve(response);
	}
};

const json = (response) => {
  	return response.json();
};

const dateFormat = (date) => {
	const month = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"Mei",
		"Jun",
		"Jul",
		"Agu",
		"Sep",
		"Okt",
		"Nov",
		"Des",
	];

	const dateSplit = date.split("T")[0].split("-");
	const timeSplit = date.split("T")[1].split("Z")[0].split(":");

  	return `${dateSplit[2]} ${month[parseInt(dateSplit[1]) - 1]} ${dateSplit[0]}, ${timeSplit[0]}:${timeSplit[1]}`;
};

const onSaveJadwal = (idClub) => {
	fetch(`${BASE_URL}/matches/${idClub}`, {
		headers: {
		  "X-Auth-Token": "727ddb3623514ebba21c393782801f4a",
		},
	})
	.then(status)
	.then(json)
	.then((jadwal) => {
	  saveJadwal(jadwal.match)
	    .then((res) => {
		      if (res.status == "OK") {
		        M.toast({ html: "Berhasil menyimpan jadwal!" });
		      } else {
		       	M.toast({ html: "Gagal menyimpan jadwal" });
		      }

		      getJadwal();
	    })
	    .catch((err) => {
		      if (err.status == "FAIL") {
		        M.toast({ html: "Gagal menyimpan jadwal" });
		      }
	    });
	})
	.catch((err) => {
	  	M.toast({ html: "Jadwal Sudah Tersimpan!" });
	});
};

const onSaveJadwalDelete = (idClub) => {
	deleteJadwalSaved(parseInt(idClub))
	.then((result) => {
	  if (result.status == "OK") {
	    M.toast({ html: "Berhasil menghapus jadwal!" });
	  } else {
	    M.toast({ html: "Gagal menghapus jadwal!" });
	  }

	  getJadwalSaved();
	})
	.catch((error) => {
	  M.toast({ html: "Gagal menghapus jadwal!" });
	});
};

const sliceText = (text, length) => {
  if (text.trim().length > length) {
    return text.trim().substring(0, length) + "...";
  }

  return text;
};

const getKlasemen = () => {
	const tbody = document.getElementById("tabel-klasemen");

	tbody.innerHTML = ``;

	for (let i = 0; i < 20; i++) {
		tbody.innerHTML += `
			<tr>
				<td><div class="loading"></div></td>
				<td><div class="loading"></div></td>
				<td><div class="loading"></div></td>
				<td><div class="loading"></div></td>
				<td><div class="loading"></div></td>
				<td><div class="loading"></div></td>
				<td><div class="loading"></div></td>
			</tr>
		`;
	}

	if ("caches" in window) {
		caches
		  .match(`${BASE_URL}/competitions/2021/standings`)
		  .then(function (response) {
		    if (response) {
		      response.json().then(function (data) {
		        const tbody = document.getElementById("tabel-klasemen");

		        tbody.innerHTML = ``;

		        data.standings[0].table.forEach((team) => {
		          let status = "";

					if (team.position >= 1 && team.position <= 4) {
						status = "border-ucl";
					} else if (team.position == 5) {
						status = "border-uel";
					} else if (team.position >= 18 && team.position <= 20) {
						status = "border-degra";
					}

		          	tbody.innerHTML += `
						<tr class="${status}">
							<th>${team.position}</th>
							<th class="center-v">
								<img src="${team.team.crestUrl}" width="24" class="mr-8" alt="Logo ${team.team.name}"> ${team.team.name}
							</th>
							<td>${team.playedGames}</td>
							<td>${team.won}</td>
							<td>${team.draw}</td>
							<td>${team.lost}</td>
							<th class="center-align">${team.points}</th>
						</tr>
					`;
		        });
		      });
		    } else {
		      fetch(`${BASE_URL}/competitions/2021/standings`, {
		        headers: {
		          "X-Auth-Token": "727ddb3623514ebba21c393782801f4a",
		        },
		      })
		        .then(status)
		        .then(json)
		        .then((data) => {
		          const tbody = document.getElementById("tabel-klasemen");

		          tbody.innerHTML = ``;

		          data.standings[0].table.forEach((team) => {
		            let status = "";

		            if (team.position >= 1 && team.position <= 4) {
		              status = "border-ucl";
		            } else if (team.position == 5) {
		              status = "border-uel";
		            } else if (team.position >= 18 && team.position <= 20) {
		              status = "border-degra";
		            }

		            tbody.innerHTML += `
						<tr class="${status}">
							<th>${team.position}</th>
							<th class="center-v">
								<img src="${team.team.crestUrl}" width="24" class="mr-8" alt="Logo ${team.team.name}"> ${team.team.name}
							</th>
							<td>${team.playedGames}</td>
							<td>${team.won}</td>
							<td>${team.draw}</td>
							<td>${team.lost}</td>
							<th class="center-align">${team.points}</th>
						</tr>
					`;

		          });
		        });
		    }
		  });
	}
};

const getJadwal = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const idClub = urlParams.get("id");

  const containerJadwal = document.getElementById("data-jadwal");

  containerJadwal.innerHTML = ``;

  for (let i = 0; i < 4; i++) {
    containerJadwal.innerHTML += `
		<div class="col s12 m6 l6 xl4 mb-16 pr-8 pl-8">
			<div class="card-custom border-default">
				<div class="row mx-0 mb-0 w-100">
					<div class="col s10 pl-0 text-bold color-purple">
						<div class="loading"></div>
					</div>
					<div class="col s2 pr-0 pl-0 right-align">
						<div class="loading"></div>
					</div>
					<div class="col s10 pl-0 text-bold color-purple">
						<div class="loading mt-8"></div>
					</div>
					<div class="col s2 pr-0 pl-0 right-align">
						<div class="loading mt-8"></div>
					</div>
					<div class="col s12 pr-0 pl-0 loading mt-8">
					</div>
				</div>
			</div>
		</div>
	`;
  }

  if ("caches" in window) {
    caches
      .match(`${BASE_URL}/teams/${idClub}/matches?status=SCHEDULED`)
      .then((response) => {
        if (response) {
          response.json().then((data) => {
            const containerJadwal = document.getElementById("data-jadwal");

            containerJadwal.innerHTML = ``;

            data.matches.forEach((match) => {
              let status = "border-default";

              if (match.competition.id == 2001) {
                status = "border-ucl";
              }

              getJadwalSavedById(match.id)
                .then((res) => {
                  containerJadwal.innerHTML += `
						<div class="col s12 m6 l6 xl4 mb-16 pr-8 pl-8">
							<div class="card-custom ${status}">
								<div class="row mx-0 mb-0 w-100">
									<div class="col s10 pl-0 ${match.homeTeam.id == idClub ? "text-bold" : ""}">
										${sliceText(match.homeTeam.name, 20)}
									</div>
									<div class="col s2 pr-0 pl-0 right-align">
										${match.score.fullTime.homeTeam == null ? "0" : match.score.fullTime.homeTeam}
									</div>
									<div class="col s10 pl-0 ${match.awayTeam.id == idClub ? "text-bold" : ""}">
										${sliceText(match.awayTeam.name, 20)}
									</div>
									<div class="col s2 pr-0 pl-0 right-align">
										${match.score.fullTime.awayTeam == null ? "0" : match.score.fullTime.awayTeam}
									</div>
									<div class="col s12 pr-0 pl-0 badge-jadwal mt-16">
										<div class="row mx-0 mb-0 w-100 center-v">
											<div class="col s10 pl-0 fs-12 text-bold color-purple">
												${dateFormat(match.utcDate)}
											</div>
											<div class="col s2 pr-0 pl-0 right-align">
												${res
													? `<a href="#" class="color-grey" onclick=""><i class="material-icons fs-18">notifications_active</i></a>`
	                    							: `<a href="#" class="color-purple" onclick="onSaveJadwal('${match.id}')"><i class="material-icons fs-18">notifications_active</i></a>`
	            								}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					`;
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          });
        } else {
          fetch(`${BASE_URL}/teams/${idClub}/matches?status=SCHEDULED`, {
            headers: {
              "X-Auth-Token": "727ddb3623514ebba21c393782801f4a",
            },
          })
            .then(status)
            .then(json)
            .then((data) => {
              const containerJadwal = document.getElementById("data-jadwal");

              containerJadwal.innerHTML = ``;

              data.matches.forEach((match) => {
                let status = "border-default";

                if (match.competition.id == 2001) {
                  status = "border-ucl";
                }

                getJadwalSavedById(match.id)
                  .then((res) => {
                    containerJadwal.innerHTML += `
							<div class="col s12 m6 l6 xl4 mb-16 pr-8 pl-8">
								<div class="card-custom ${status}">
									<div class="row mx-0 mb-0 w-100">
										<div class="col s10 pl-0 ${match.homeTeam.id == idClub ? "text-bold" : ""}">
											${sliceText(match.homeTeam.name, 20)}
										</div>
										<div class="col s2 pr-0 pl-0 right-align">
											${match.score.fullTime.homeTeam == null ? "0" : match.score.fullTime.homeTeam}
										</div>
										<div class="col s10 pl-0 ${match.awayTeam.id == idClub ? "text-bold" : ""}">
											${sliceText(match.awayTeam.name, 20)}
										</div>
										<div class="col s2 pr-0 pl-0 right-align">
											${match.score.fullTime.awayTeam == null ? "0" : match.score.fullTime.awayTeam}
										</div>
										<div class="col s12 pr-0 pl-0 badge-jadwal mt-16">
											<div class="row mx-0 mb-0 w-100 center-v">
												<div class="col s10 pl-0 fs-12 text-bold color-purple">
													${dateFormat(match.utcDate)}
												</div>
												<div class="col s2 pr-0 pl-0 right-align">
													${res
														? `<a href="#" class="color-grey" onclick=""><i class="material-icons fs-18">notifications_active</i></a>`
	                        							: `<a href="#" class="color-purple" onclick="onSaveJadwal('${match.id}')"><i class="material-icons fs-18">notifications_active</i></a>`
	                    							}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						`;
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            })
            .catch(() => {
              const containerJadwal = document.getElementById("data-jadwal");

              containerJadwal.innerHTML = `<div class="col s12 center-align">Data Belum Tersimpan di Cache :(</div>`;
            });
        }
      });
  }
};

const getJadwalSaved = () => {
  	const containerJadwal = document.getElementById("data-jadwal-saved");

  	containerJadwal.innerHTML = ``;

	for (let i = 0; i < 4; i++) {
	    containerJadwal.innerHTML += `
			<div class="col s12 m6 l6 xl4 mb-16 pr-8 pl-8">
				<div class="card-custom border-default">
					<div class="row mx-0 mb-0 w-100">
						<div class="col s10 pl-0 text-bold color-purple">
							<div class="loading"></div>
						</div>
						<div class="col s2 pr-0 pl-0 right-align">
							<div class="loading"></div>
						</div>
						<div class="col s10 pl-0 text-bold color-purple">
							<div class="loading mt-8"></div>
						</div>
						<div class="col s2 pr-0 pl-0 right-align">
							<div class="loading mt-8"></div>
						</div>
						<div class="col s12 pr-0 pl-0 loading mt-8">
						</div>
					</div>
				</div>
			</div>
		`;
	}

	getJadwalSavedAll()
	.then((jadwal) => {
	  if (jadwal.length > 0) {
	    containerJadwal.innerHTML = ``;

	    jadwal.forEach((match, i) => {
	      let status = "border-default";

	      if (match.competition.id == 2001) {
	        status = "border-ucl";
	      }

	      containerJadwal.innerHTML += `
				<div class="col s12 m6 l6 xl4 mb-16 pr-8 pl-8">
					<div class="card-custom ${status}">
						<div class="row mx-0 mb-0 w-100">
							<div class="col s11 pr-0 pl-0 text-bold">
								${match.homeTeam.name}
							</div>
							<div class="col s1 pl-0 pr-0 right-align pr-4">
								${match.score.fullTime.homeTeam != null ? match.score.fullTime.homeTeam : "0"}
							</div>
							<div class="col s11 pr-0 pl-0 text-bold">
								${match.awayTeam.name}
							</div>
							<div class="col s1 pl-0 pr-0 right-align pr-4">
								${match.score.fullTime.awayTeam != null ? match.score.fullTime.homeTeam : "0"}
							</div>
							<div class="col s11 pr-0 pl-0 badge-jadwal color-purple mt-16 text-bold">
								${dateFormat(match.utcDate)}
							</div>
							<div class="col s1 pr-0 pl-0 mt-20 right-align">
								<a href="#" class="color-red" onclick="onSaveJadwalDelete('${match.id}')"><i class="material-icons fs-18">notifications_off</i></a>
							</div>
						</div>
					</div>
				</div>
			`;
	    });
	  } else {
	    containerJadwal.innerHTML = ``;

	    containerJadwal.innerHTML += `
			<div class="col s12 mb-16 pr-8 pl-8 center-align">
				Tidak ada jadwal tersimpan
			</div>
		`;
	  }
	})
	.catch((error) => {
	  console.log(error);
	});
};

const getTeam = () => {
  const tbody = document.getElementById("data-team");

  tbody.innerHTML = ``;

  for (let i = 0; i < 20; i++) {
    tbody.innerHTML += `
		<div class="col s6 m4 l4 xl3 mb-16 pr-8 pl-8">
			<div class="card-custom">
				<div class="row mb-0">
					<div class="col s2 center-v-h">
						<div class="loading"></div>
					</div>
					<div class="col s6 center-v h-100 pr-0 pl-0">
						<div class="loading"></div>
					</div>
					<div class="col s2">
						<div class="loading"></div>
					</div>
					<div class="col s2">
						<div class="loading"></div>
					</div>
				</div>							
			</div>
		</div>
	`;
  }

  if ("caches" in window) {
    caches
      .match(`${BASE_URL}/competitions/2021/teams`)
      .then(function (response) {
        if (response) {
          response.json().then(function (data) {
            const tbody = document.getElementById("data-team");

            tbody.innerHTML = ``;

            data.teams.forEach((team) => {
              let status = "";

              if (team.position >= 1 && team.position <= 4) {
                status = "border-ucl";
              } else if (team.position == 5) {
                status = "border-uel";
              } else if (team.position >= 18 && team.position <= 20) {
                status = "border-degra";
              }

              tbody.innerHTML += `
					<div class="col s12 m6 l6 lg6 mb-16 pr-8 pl-8">
						<div class="card-custom">
							<div class="row mb-0">
								<div class="col s2 center-v-h">
									<img src="${team.crestUrl}" style="width: 24px;" alt="Logo ${team.name}">
								</div>
								<div class="col s6 center-v h-100 mt-4">
									<p class="text-bold color-purple mb-0 mt-0">${sliceText(team.name, 12)}</p>
								</div>
								<div class="col s2">
									<a href="/pages/teams_detail.html?id=${team.id}"><i class="material-icons">library_books</i></a>
								</div>
								<div class="col s2">
									<a href="/pages/schedule.html?id=${team.id}"><i class="material-icons">date_range</i></a>
								</div>
							</div>							
						</div>
					</div>
				`;
            });
          });
        } else {
          fetch(`${BASE_URL}/competitions/2021/teams`, {
            headers: {
              "X-Auth-Token": "727ddb3623514ebba21c393782801f4a",
            },
          })
            .then(status)
            .then(json)
            .then((data) => {
              console.log(data.teams);
              const tbody = document.getElementById("data-team");

              tbody.innerHTML = ``;

              data.teams.forEach((team) => {
                tbody.innerHTML += `
					<div class="col s12 m6 l6 lg6 mb-16 pr-8 pl-8">
						<div class="card-custom">
							<div class="row mb-0">
								<div class="col s2 center-v-h">
									<img src="${team.crestUrl}" style="width: 24px;" alt="Logo ${team.name}">
								</div>
								<div class="col s6 center-v h-100 mt-4">
									<p class="text-bold color-purple mb-0 mt-0">${sliceText(team.name, 12)}</p>
								</div>
								<div class="col s2">
									<a href="/pages/teams_detail.html?id=${team.id}"><i class="material-icons">library_books</i></a>
								</div>
								<div class="col s2">
									<a href="/pages/schedule.html?id=${team.id}"><i class="material-icons">date_range</i></a>
								</div>
							</div>							
						</div>
					</div>
				`;
              });
            });
        }
      });
  }
};

const getTeamDetail = () => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	const idClub = urlParams.get("id");

	const containDesc = document.getElementById("team-desc");
	const containPlayer = document.getElementById("team-player");

  	containDesc.innerHTML = ``;
  	containPlayer.innerHTML = ``;

  	containDesc.innerHTML += `
  		<div class="col s12 card-custom">
			<div class="row mb-0">
				<div class="col s12 m4 l4 center-v-h">
					<div class="loading" style="height: 200px"></div>
				</div>
				<div class="col s12 m8 l8">
					<div class="mb-8">
						<div class="loading mb-8"></div>
						<div class="loading"></div>
					</div>
					<div class="mb-8">
						<div class="loading mb-8"></div>
						<div class="loading"></div>
					</div>
					<div class="mb-8">
						<div class="loading mb-8"></div>
						<div class="loading"></div>
					</div>
					<div class="mb-8">
						<div class="loading mb-8"></div>
						<div class="loading"></div>
					</div>
					<div>
						<div class="loading mb-8"></div>
						<div class="loading"></div>
					</div>
				</div>
			</div>
		</div>
  	`;

  	for(let i=0; i<3; i++) {
  		containPlayer.innerHTML += `
  			<div class="col s12 m4 l4 pr-8 pl-8 mb-8">
				<div class="card-custom">
					<p class="fs-14 mb-0 mt-0 text-bold">
						<div class="loading"></div>
					</p>
					<p class="fs-12 mb-0 mt-0 color-grey">
						<div class="loading"></div>
					</p>
				</div>
			</div>
  		`;
  	}

	if ("caches" in window) {
	   caches
	     .match(`${BASE_URL}/teams/${idClub}`)
	     .then(function (response) {
	       if (response) {
	        const containDesc = document.getElementById("team-desc");
            const containPlayer = document.getElementById("team-player");

            containDesc.innerHTML = ``;
            containPlayer.innerHTML = ``;

            response.json().then((data) => {
            	containDesc.innerHTML += `
					<div class="col s12 card-custom">
						<div class="row mb-0">
							<div class="col s12 m4 l4 center-v-h">
								<img src="${data.crestUrl}" width="100%">
							</div>
							<div class="col s12 m8 l8">
								<div class="mb-8">
									<p class="fs-12 mt-0 mb-8 color-grey">Nama</p>
									<p class="fs-14 mt-0 mb-0 color-purple text-bold">${data.name}</p>
								</div>
								<div class="mb-8">
									<p class="fs-12 mt-0 mb-8 color-grey">Nama Pendek</p>
									<p class="fs-14 mt-0 mb-0 text-bold">${data.shortName}</p>
								</div>
								<div class="mb-8">
									<p class="fs-12 mt-0 mb-8 color-grey">Alamat</p>
									<p class="fs-14 mt-0 mb-0 text-bold">${data.address}</p>
								</div>
								<div class="mb-8">
									<p class="fs-12 mt-0 mb-8 color-grey">Warna Team</p>
									<p class="fs-14 mt-0 mb-0 text-bold">${data.clubColors}</p>
								</div>
								<div>
									<p class="fs-12 mt-0 mb-8 color-grey">Nama Stadion</p>
									<p class="fs-14 mt-0 mb-0 text-bold">${data.venue}</p>
								</div>
							</div>
						</div>
					</div>
				`;

				data.squad.forEach((player) => {
					containPlayer.innerHTML += `
						<div class="col s12 m4 l4 pr-8 pl-8 mb-8">
							<div class="card-custom">
								<p class="fs-14 mb-0 mt-0 text-bold">
									${sliceText(player.name, 24)}
								</p>
								<p class="fs-12 mb-0 mt-0 color-grey">
									${player.position != null ? player.position : '-' }
								</p>
							</div>
						</div>
					`;
				});
            });

	       } else {
	         fetch(`${BASE_URL}/teams/${idClub}`, {
				headers: {
				 	"X-Auth-Token": "727ddb3623514ebba21c393782801f4a",
				},
	         })
	           .then(status)
	           .then(json)
	           .then((data) => {
	            const containDesc = document.getElementById("team-desc");
	            const containPlayer = document.getElementById("team-player");

	            containDesc.innerHTML = ``;
	            containPlayer.innerHTML = ``;

	            containDesc.innerHTML += `
					<div class="col s12 card-custom">
						<div class="row mb-0">
							<div class="col s12 m4 l4 center-v-h">
								<img src="${data.crestUrl}" width="100%">
							</div>
							<div class="col s12 m8 l8">
								<div class="mb-8">
									<p class="fs-12 mt-0 mb-8 color-grey">Nama</p>
									<p class="fs-14 mt-0 mb-0 color-purple text-bold">${data.name}</p>
								</div>
								<div class="mb-8">
									<p class="fs-12 mt-0 mb-8 color-grey">Nama Pendek</p>
									<p class="fs-14 mt-0 mb-0 text-bold">${data.shortName}</p>
								</div>
								<div class="mb-8">
									<p class="fs-12 mt-0 mb-8 color-grey">Alamat</p>
									<p class="fs-14 mt-0 mb-0 text-bold">${data.address}</p>
								</div>
								<div class="mb-8">
									<p class="fs-12 mt-0 mb-8 color-grey">Warna Team</p>
									<p class="fs-14 mt-0 mb-0 text-bold">${data.clubColors}</p>
								</div>
								<div>
									<p class="fs-12 mt-0 mb-8 color-grey">Nama Stadion</p>
									<p class="fs-14 mt-0 mb-0 text-bold">${data.venue}</p>
								</div>
							</div>
						</div>
					</div>
				`;

				data.squad.forEach((player) => {
					containPlayer.innerHTML += `
						<div class="col s12 m4 l4 pr-8 pl-8 mb-8">
							<div class="card-custom">
								<p class="fs-14 mb-0 mt-0 text-bold">
									${sliceText(player.name, 24)}
								</p>
								<p class="fs-12 mb-0 mt-0 color-grey">
									${player.position != null ? player.position : '-' }
								</p>
							</div>
						</div>
					`;
				});

	           });
	       	}
	    });
	 }
}