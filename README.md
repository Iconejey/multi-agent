## Evolution of an epidemic disease with different sanitary measures in a multi-agent system.

By Nicolas Gouwy.

-   [Introduction](#introduction)
-   [Model](#model)
-   [Epidemic](#epidemic)
-   [Sanitary measures](#sanitary-measures)
    -   [Barrier actions](#barrier-actions)
    -   [Lockdown](#lockdown)
    -   [Vaccination](#vaccination)
    -   [Combinations](#combinations)
-   [Conclusion](#conclusion)

## Introduction

This study is about the evolution of a non-lethal epidemic disease in a multi-agent system for a period of 4 years. The government will use different sanitary measures in order to:

-   Prevent **hospital overload**, here defined by more than **20%** of the population being infected.
-   Limit the **total number of infections** during the studied period.
-   **Eradicate** the disease.

We will see how the different measures affect the evolution of the disease and how they help to achieve theses goals.

## Model

<div>
<img src="./results/model.jpg" alt="Model" width="45%" style="border-radius: 5px; float: right;" />
</div>

The model is based on the [SIRV model](https://en.wikipedia.org/wiki/Compartmental_models_in_epidemiology#The_SIRV_model). We have a square-shaped world of size **20** and **1000** agents represented by a circle of diameter **1**. The agents are distributed randomly in the world and move with random direction and acceleration. Once they hit the borders they bounce.

The agents are divided in four groups:

-   <span style="color:#7fa5f8">**Susceptible**</span> (in blue)
-   <span style="color:#dc6b73">**Infected**</span> (in red)
-   <span style="color:#bade87">**Recovered**</span> (in green)
-   <span style="color:#ffcb6c">**Vaccinated**</span> (in yellow)

<div style="page-break-after: always; break-after: page;"></div>

## Epidemic

Among the population of 1000 agents, **10** agents are <span style="color:#dc6b73">**infected**</span> at the beginning of the simulation. They are contagious and can infect <span style="color:#7fa5f8">**susceptible**</span> agents. The probability of getting infected is **8%** per day of contact so if a <span style="color:#7fa5f8">**susceptible**</span> agent is in contact with an <span style="color:#dc6b73">**infected**</span> agent for half a day, there is a **4%** chance that the <span style="color:#7fa5f8">**susceptible**</span> agent gets <span style="color:#dc6b73">**infected**</span>.

The disease is not lethal and the recovery time is between **20** and **30** days after which the <span style="color:#dc6b73">**infected**</span> agent will be <span style="color:#bade87">**recovered**</span> and immune to the disease for the next **60** to **90** days (about 2 to 3 months) before becoming <span style="color:#7fa5f8">**susceptible**</span> again.

<span style="color:#7fa5f8">**Susceptible**</span> agents can become <span style="color:#ffcb6c">**Vaccinated**</span> depending on the [vaccination](#vaccination) policy implemented by the government. In this case the agent has **90%** less chance of getting infected. The vaccine is effective for the next **120** to **180** days (about 4 to 6 months) after which the agent will be <span style="color:#7fa5f8">**susceptible**</span> again.

Here is a graph of the number of <span style="color:#7fa5f8">**susceptible**</span>, <span style="color:#dc6b73">**infected**</span> and <span style="color:#bade87">**recovered**</span> agents during the simulation of 4 years without any sanitary measures:

<p align="center">
<img src="./results/Number of people as a function of time.jpg"/>
</p>

We can see that the number of <span style="color:#dc6b73">**infected**</span> agents peaks at **366** in 2 months. This is more than **1/3** of the population. That means that there is a massive **hospital overload** with **166** people over the limit of **20%** of the population. There is a total of **10** peaks of <span style="color:#dc6b73">**infected**</span> agents during the 4 years and all of them are above this limit.

The **total number of infections** is **8285** which means each agent gets infected **8.3** times in average during the 4 years period.

As expected, the disease was not **eradicated**.

<div style="page-break-after: always; break-after: page;"></div>

## Sanitary measures

### Barrier actions

Barrier actions are the first measure we will simulate as it is the first thing people do in case of epidemics. No need of government intervention for people to:

-   Wash their hands and avoid touching their face
-   Cough and sneeze in their elbow
-   Limit contact with others and stay at safe distance
-   Wear masks

To simulate barrier actions we will reduce the probability of agents getting infected by **25%** in case of light barrier actions and **50%** in case of heavy barrier actions.

#### Light barrier actions

<p align="center">
<img src="./results/light barrier actions.jpg"/>
</p>

We can see in this simulation with light barrier gestures that there are now only **8** distinct peaks of <span style="color:#dc6b73">**infected**</span> agents and only the 1<sup>st</sup> (in the first half year) and the 5<sup>th</sup> (at year 2) peaks are above the limit of **20%** of the population with respectively **242** and **208** <span style="color:#dc6b73">**infected**</span> agents. This means that there are two **hospital overloads** with about two years of difference.

The **total number of infections** is **6297** which is **24%** less than without barrier actions.

<div style="page-break-after: always; break-after: page;"></div>

#### Heavy barrier actions

<p align="center">
<img src="./results/heavy barrier actions.jpg"/>
</p>

We can see in this simulation with heavy barrier gestures that there are still two distinct peaks in the 1<sup>st</sup> year but then the number of <span style="color:#dc6b73">**infected**</span> agents stays between **48** and **116**. The number of <span style="color:#dc6b73">**infected**</span> agents never goes over **152** which means that there is no **hospital overload**.

The **total number of infections** also dropped to **4215** which is **49%** less than without barrier actions.

#### Conclusions

The disease could not be **eradicated** with barrier actions but it certainly helped a lot with limiting and even eliminating **hospital overload**. It has also helped to reduce the **total number of infections** by up to half.

<div style="page-break-after: always; break-after: page;"></div>

### Lockdown

The lockdown is the second measure we will simulate. The government tells people to stay at home and to avoid going out. Sometimes even a travel distance limit is imposed. To simulate the lockdown we will reduce the speed of the agents by **75%** in case of light lockdown and **90%** in case of strict lockdown.

The people can not be in lockdown forever so the government will impose a **lockdown** only if the number of <span style="color:#dc6b73">**infected**</span> agents is above **150** and cancel it of the number of <span style="color:#dc6b73">**infected**</span> agents goes back below **100** with a minimal delay of **14** days. These limits are shown on the graph by a horizontal rectangle and locked down periods are shown by vertical rectangles.

#### Light lockdown

<p align="center">
<img src="./results/light lockdown.jpg"/>
</p>

We can see in this simulation with light lockdown that there still **10** peaks of <span style="color:#dc6b73">**infected**</span> agents and all of them were above the lockdown limit. The 5<sup>th</sup> and 6<sup>th</sup> peaks were even in the same lockdown since the number of <span style="color:#dc6b73">**infected**</span> agents after the 5<sup>th</sup> peak did not go below the lockdown limit before the 6<sup>th</sup> peak (minimum of **102**). This means that there is a total of **9** lockdown periods.

There are **8** peaks of <span style="color:#dc6b73">**infected**</span> agents above the limit of **20%** of the population so for a peroid of 4 years, light lockdown only prevented two **hospital overloads**.

The **total number of infections** is **8208** which is only **1%** less than without lockdown.

<div style="page-break-after: always; break-after: page;"></div>

#### Strict lockdown

<p align="center">
<img src="./results/strict lockdown.jpg"/>
</p>

We can see in this simulation with strict lockdown that there are **10** peaks that are all above the lockdown limit. This time the lock down is efficient enough to drag all peaks down below the lockdown limit before the next one.

Out of **10** peaks there are **5** peaks only above the **20%** limit of the population. This means that strict lockdown could prevent **5** **hospital overloads**.

The **total number of infections** is **7872** which is **5%** less than without lockdown.

#### Conclusions

Lock down are effective to limit the number of **hospital overloads** but they are not effective to prevent the **total number of infections**. The fact that the lockdown stops below a number of **100** <span style="color:#dc6b73">**infected**</span> agents makes it impossible to **eradicate** the disease.

<div style="page-break-after: always; break-after: page;"></div>

### Vaccination

In case of the appearance of a new disease, the government can also work hard to elaborate a vaccine and make a vaccination campaign. After 6 months, <span style="color:#7fa5f8">**susceptible**</span> agents will start to get vaccinated. The probability of getting vaccinated is calculated from the percentage of <span style="color:#7fa5f8">**susceptible**</span> agents the campaign targets to vaccinate in a week.

#### Simulation with 2% of vaccinated people per week

<p align="center">
<img src="./results/2% of vaccinated people per week.jpg"/>
</p>

We can se the number of <span style="color:#ffcb6c">**vaccinated**</span> agents starts to increase after 6 months and stabilizes around **174** one year after the beginning of the disease. Obviously the first 6 months of the simulation are not different from the initial situation but the vaccine campaign allows to prevent the number of <span style="color:#dc6b73">**infected**</span> agents to go over **199**, right at the limit of **20%** of the population. This means that after 6 months of a 2% vaccination campaign, there are no longer **hospital overloads**.

The **total number of infections** is **6358** which is **23%** less than without vaccination but not enough to **eradicate** the disease.

<div style="page-break-after: always; break-after: page;"></div>

#### Comparing different vaccination campaigns

To see how the percentage of vaccinated people per week affects the disease and helps us to reach the different goals we can compare the simulation with different vaccination campaigns:

| Campaign | Hospital overloads | Total infections | Eradication |
| -------- | ------------------ | ---------------- | ----------- |
| 0%       | 10                 | 8285             | No          |
| 1%       | 9                  | 7202 (-13%)      | No          |
| 2%       | 2                  | 6358 (-23%)      | No          |
| 3%       | 2                  | 5945 (-28%)      | No          |
| 4%       | 2                  | 4752 (-42%)      | No          |
| 5%       | 2                  | 3905 (-53%)      | No          |

We can see that from **2%** of vaccinated people per week the number of **hospital overloads** remains at **2** because the campaign is enough to prevent them but only after a year of simulation so the first 2 peaks are not affected by the vaccination campaign.

The vaccine drastically reduces the number of <span style="color:#dc6b73">**infected**</span> agents with up to **53%** less of **total infections**. This means that the vaccine campaign is effective to prevent the disease but it is not enough to **eradicate** it.

<div style="page-break-after: always; break-after: page;"></div>

### Combining different measures

Using only one measure at a time is not enough to reach all goals. We will try to combine different measures in order to do so.

#### Barrier actions and lockdown

<p align="center">
<img src="./results/heavy barrier actions and strict lockdown.jpg"/>
</p>

As heavy barrier actions were effective enough to prevent them, combining them with lockdown (which happened only on the 1<sup>st</sup> peak) does not change anything about **hospital overloads** that are still **0**.

The **total number of infections** is **3126** which is **62%** less than without sanitary measures. No **eradication** yet.

<div style="page-break-after: always; break-after: page;"></div>

#### Vaccination and lockdown

<p align="center">
<img src="./results/strict lockdown with 5% of vaccinated people per week.jpg"/>
</p>

The issue with the vaccine campaign is that it only starts after 6 months of simulation so the first 2 peaks are not affected by the vaccination campaign. The lockdown helps it by reducing the number of <span style="color:#dc6b73">**infected**</span> agents from **336** to **325** in the first peak but this is far from enough to prevent **hospital overloads**.

The **total number of infections** is **5244** which is **37%** less than without sanitary measures. No **eradication** yet.

<div style="page-break-after: always; break-after: page;"></div>

#### Barrier actions and vaccination

<p align="center">
<img src="./results/heavy barrier actions with 5% of vaccinated people per week.jpg"/>
</p>

This time the problem about the vaccine campaign starting after 6 months is solved by the barrier actions. The barrier actions are effective enough to prevent the **hospital overloads** on its own as soon as the simulation starts.

It may sound not so effective to combine the two since barrier actions on their own prevent **hospital overloads** but it really does something other combinations do not do: It lowers the contamination so much that the disease is **eradicated** after less than a year of simulation.

Since the contamination was reduced by both measures, and the disease is **eradicated** really soon, the **total number of infections** is naturally really low at **534** which is **93%** less than without sanitary measures.

_We can consider this combination as a solution to our goals._

<div style="page-break-after: always; break-after: page;"></div>

#### Combining all measures

<p align="center">
<img src="./results/barrier actions, lockdown and vaccination.jpg"/>
</p>

As the combination of barrier actions and vaccination lowers the contamination enough to never reach the limit of **150** <span style="color:#dc6b73">**infected**</span> agents, lockdown are never imposed by the government. The result is the same as combining the barrier actions and vaccination only with no **hospital overloads**, a **total number of infections** of **607** and the **eradication** of the disease in less than a year.

## Conclusion

The combination of different sanitary measures taken by the government can be used to reach the goals. The combination of barrier actions and vaccination is the most effective combination to reach all the goals and makes the lockdown unnecessary. This is not really the same as in real life conditions where lockdowns are more effective. This difference is due to the model we used. Even if the agents move 90% slower, a lot of them touch each other and the virus still spreads faster than with a real life lockdown.

Most diseases are not totaly non-lethal. Even a cold can be lethal in rare cases. It would be intersting to see a similar model with a mortality rate. For instance a disease with a short period of contagiousness and a high mortality rate would act like the black plague and eradicate itself because of the number of deaths. It would be interesting to see how sanitary measures could have helped with this epidemic.
