-- Список медорганизаций и их зданий
CREATE OR REPLACE FORCE EDITIONABLE VIEW "PARUS"."V_BELRRPABUILDING_MAP_BUILDING" ("BUILD_ID", "BUILDING_NAME", "GEO_ID", "ORGANIZATION_ID", "ORGANIZATION", "YEAR_OF_CONSTRUCTION", "FLOORS", "TOTAL_AREA", "PLAN_COUNT_VISITS", "ADDRESS", "PHONE", "EMAIL", "EREGISTRY_URL", "SITE", "WORKTIME", "USAGE_TYPE_ID", "USAGE_TYPE_NAME", "LON", "LAT") AS 
select
	b.rn,
	b.name,
	b.geografy,
	t.rn,
	a.agnname,
	b.dbuild,
	b.foolring,
	b.areabuild,
	case when t.main_building = b.rn then t.plan_count_visits else 0 end,
	f_belrrpabuilding_address(b.geografy, b.house, b.block),
	e.phone,
	e.email,
	e.eregistry_url,
	o.site,
	f_belrrpabuildingw_worktime(w.rn),
	u.usage_tp,
	ut.name,
	coalesce(b.lng, 30),
	coalesce(b.wgh, 50)
	from rrpaorgstructure t
		inner join rrpabuilding b
		left join (select *
				from belrrpabuildingw x
					where x.begdate = (select max(x1.begdate)
						from belrrpabuildingw x1
						where x1.prn = x.prn
							and x1.begdate <= sysdate
							and x1.enddate >= sysdate)) w on w.prn = b.rn
		left join belrrpabuildinga e on e.prn = b.rn
		left join belrrpabuildingu u
			inner join belrrpamedorgtp ut on ut.rn = u.usage_tp
				on u.prn = b.rn
			on b.rrpaorgstructure = t.rn
        left join rrpainformorg o on o.rrpaorgstructure = t.rn
        left join agnlist a on a.rn = t.agent;

GRANT SELECT ON "PARUS"."V_BELRRPABUILDING_MAP_BUILDING" TO PUBLIC;
